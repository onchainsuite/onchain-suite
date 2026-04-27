"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Clock, Send } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/ui/button";
import { Form } from "@/ui/form";

import { isJsonObject } from "@/lib/utils";

import {
  type CampaignFormData,
  campaignFormSchema,
} from "../../campaigns/validations";
import {
  AudienceStep,
  CampaignDetailsStep,
  ConfirmationPage,
  ScheduleStep,
  TemplateStep,
} from "../components/campaign-form";
import { campaignsService } from "@/features/campaigns/campaigns.service";
import {
  CAMPAIGN_LISTS,
  CAMPAIGN_SEGMENTS,
} from "@/features/campaigns/constants";
import { PRIVATE_ROUTES } from "@/shared/config/app-routes";

const TOTAL_STEPS = 4;
const campaignTypes = new Set<CampaignFormData["campaignType"]>([
  "email-blast",
  "drip-campaign",
  "smart-sending",
  "newsletter",
  "promotional",
  "announcement",
  "automation",
]);
const sendOptions = new Set<CampaignFormData["sendOption"]>([
  "now",
  "schedule",
]);

const asCampaignType = (
  value: unknown
): CampaignFormData["campaignType"] | undefined => {
  if (typeof value !== "string") return undefined;
  return campaignTypes.has(value as CampaignFormData["campaignType"])
    ? (value as CampaignFormData["campaignType"])
    : undefined;
};

const asSendOption = (
  value: unknown
): CampaignFormData["sendOption"] | undefined => {
  if (typeof value !== "string") return undefined;
  return sendOptions.has(value as CampaignFormData["sendOption"])
    ? (value as CampaignFormData["sendOption"])
    : undefined;
};

export function CreateCampaignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialStep = useMemo(() => {
    const raw = Number(searchParams.get("step") ?? "1");
    if (!Number.isFinite(raw)) return 1;
    return Math.min(TOTAL_STEPS, Math.max(1, Math.trunc(raw)));
  }, [searchParams]);

  const initialCampaignFromUrl = useMemo(() => {
    const raw = searchParams.get("campaign");
    return raw && raw.trim().length > 0 ? raw.trim() : undefined;
  }, [searchParams]);

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [campaignId, setCampaignId] = useState<string | undefined>(
    initialCampaignFromUrl
  );
  const [isBootstrappingCampaign, setIsBootstrappingCampaign] = useState(false);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);
  const [isHydratingCampaign, setIsHydratingCampaign] = useState(false);
  const [hasHydratedCampaign, setHasHydratedCampaign] = useState(false);

  const campaignIdRef = useRef<string | undefined>(campaignId);
  const currentStepRef = useRef<number>(currentStep);
  const isHydratingRef = useRef<boolean>(isHydratingCampaign);
  const isBootstrappingRef = useRef<boolean>(isBootstrappingCampaign);
  const isBootstrappingInFlightRef = useRef<boolean>(false);
  const lastAutosavePayloadRef = useRef<string>("");

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      campaignName: "",
      campaignType: "email-blast",
      template: "",
      selectedAudiences: [],
      smartSending: true,
      trackingParameters: true,
      selectedTemplate: "",
      emailSubject: "",
      previewText: "",
      senderName: "Pivotup Media",
      senderEmail: "",
      useReplyTo: true,
      replyToEmail: "",
      sendOption: "now",
      scheduleTime: "09:00",
      timezone: "UTC",
    },
  });

  useEffect(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  useEffect(() => {
    campaignIdRef.current = campaignId;
  }, [campaignId]);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    isHydratingRef.current = isHydratingCampaign;
  }, [isHydratingCampaign]);

  useEffect(() => {
    isBootstrappingRef.current = isBootstrappingCampaign;
  }, [isBootstrappingCampaign]);

  useEffect(() => {
    const ensureCampaign = async () => {
      if (campaignIdRef.current) return;
      if (isBootstrappingInFlightRef.current) return;
      if (bootstrapError) return;

      isBootstrappingInFlightRef.current = true;
      setIsBootstrappingCampaign(true);
      setBootstrapError(null);
      try {
        const created = await campaignsService.createCampaign({
          name: "Untitled campaign",
          type: form.getValues("campaignType"),
          status: "draft",
        });
        if (!created?.id) throw new Error("Failed to create campaign draft");
        setCampaignId(created.id);

        const next = new URLSearchParams(searchParams.toString());
        next.set("campaign", created.id);
        next.set("step", String(currentStepRef.current));
        router.replace(`/campaigns/new?${next.toString()}`);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to create campaign";
        setBootstrapError(message);
        toast.error(message);
      } finally {
        setIsBootstrappingCampaign(false);
        isBootstrappingInFlightRef.current = false;
      }
    };

    ensureCampaign().catch(() => undefined);
  }, [bootstrapError, form, router, searchParams]);

  useEffect(() => {
    const hydrate = async () => {
      if (!campaignId) return;
      if (hasHydratedCampaign) return;

      if (!initialCampaignFromUrl) {
        setHasHydratedCampaign(true);
        return;
      }

      setIsHydratingCampaign(true);
      try {
        const [campaignRes, contentRes, audienceRes, trackingRes, scheduleRes] =
          await Promise.allSettled([
            campaignsService.getCampaign(campaignId),
            campaignsService.getContent(campaignId),
            campaignsService.getAudience(campaignId),
            campaignsService.getTracking(campaignId),
            campaignsService.getSchedule(campaignId),
          ]);

        const nextValues: Partial<CampaignFormData> = {};

        if (campaignRes.status === "fulfilled") {
          const cObj: Record<string, unknown> = isJsonObject(campaignRes.value)
            ? campaignRes.value
            : {};
          const { name: campaignName, type, template, templateId } = cObj;
          if (typeof campaignName === "string" && campaignName.length > 0) {
            nextValues.campaignName = campaignName;
          }
          const campaignType = asCampaignType(type);
          if (campaignType) nextValues.campaignType = campaignType;
          if (typeof template === "string") {
            nextValues.template = template;
          }
          if (typeof templateId === "string") {
            nextValues.selectedTemplate = templateId;
          }
        }

        if (contentRes.status === "fulfilled") {
          const cObj: Record<string, unknown> = isJsonObject(contentRes.value)
            ? contentRes.value
            : {};
          const {
            subject,
            previewText,
            senderName,
            senderEmail,
            replyToEmail,
          } = cObj;
          if (typeof subject === "string" || subject === null) {
            nextValues.emailSubject = String(subject ?? "");
          }
          if (typeof previewText === "string" || previewText === null) {
            nextValues.previewText = String(previewText ?? "");
          }
          if (typeof senderName === "string" || senderName === null) {
            nextValues.senderName = String(senderName ?? "");
          }
          if (typeof senderEmail === "string" || senderEmail === null) {
            nextValues.senderEmail = String(senderEmail ?? "");
          }
          if ("replyToEmail" in cObj) {
            const reply = typeof replyToEmail === "string" ? replyToEmail : "";
            nextValues.replyToEmail = reply;
            nextValues.useReplyTo = reply.length > 0;
          }
        }

        if (audienceRes.status === "fulfilled") {
          const aObj: Record<string, unknown> = isJsonObject(audienceRes.value)
            ? audienceRes.value
            : {};
          const { listIds: listIdsRaw, segmentIds: segmentIdsRaw } = aObj;
          const listIds = Array.isArray(listIdsRaw)
            ? listIdsRaw.map(String)
            : [];
          const segmentIds = Array.isArray(segmentIdsRaw)
            ? segmentIdsRaw.map(String)
            : [];
          if (listIds.length || segmentIds.length) {
            nextValues.selectedAudiences = [...listIds, ...segmentIds];
          }
        }

        if (trackingRes.status === "fulfilled") {
          const tObj: Record<string, unknown> = isJsonObject(trackingRes.value)
            ? trackingRes.value
            : {};
          const { smartSending, trackingParameters } = tObj;
          if (typeof smartSending === "boolean") {
            nextValues.smartSending = smartSending;
          }
          if (typeof trackingParameters === "boolean") {
            nextValues.trackingParameters = trackingParameters;
          }
        }

        if (scheduleRes.status === "fulfilled") {
          const sObj: Record<string, unknown> = isJsonObject(scheduleRes.value)
            ? scheduleRes.value
            : {};
          const {
            sendOption: sendOptionRaw,
            scheduleTime,
            timezone,
            scheduleDate,
          } = sObj;
          const sendOption = asSendOption(sendOptionRaw);
          if (sendOption) nextValues.sendOption = sendOption;
          if (typeof scheduleTime === "string" || scheduleTime === null) {
            nextValues.scheduleTime = String(scheduleTime ?? "");
          }
          if (typeof timezone === "string" || timezone === null) {
            nextValues.timezone = String(timezone ?? "");
          }
          if (typeof scheduleDate === "string") {
            const parsed = new Date(scheduleDate);
            if (!Number.isNaN(parsed.getTime()))
              nextValues.scheduleDate = parsed;
          }
        }

        if (Object.keys(nextValues).length > 0) {
          form.reset({ ...form.getValues(), ...nextValues });
        }
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to load campaign";
        toast.error(message);
      } finally {
        setHasHydratedCampaign(true);
        setIsHydratingCampaign(false);
      }
    };

    hydrate().catch(() => undefined);
  }, [campaignId, form, hasHydratedCampaign, initialCampaignFromUrl]);

  useEffect(() => {
    if (!campaignId) return;

    const interval = setInterval(() => {
      const id = campaignIdRef.current;
      if (!id) return;
      if (isHydratingRef.current) return;
      if (isBootstrappingRef.current) return;

      const values = form.getValues();
      const scheduleDateIso =
        values.scheduleDate instanceof Date
          ? values.scheduleDate.toISOString()
          : undefined;

      const payload = {
        step: currentStepRef.current,
        ...values,
        scheduleDate: scheduleDateIso,
      };

      const serialized = JSON.stringify(payload);
      if (serialized === lastAutosavePayloadRef.current) return;
      lastAutosavePayloadRef.current = serialized;

      campaignsService.autosaveCampaign(id, payload).catch(() => undefined);
    }, 15000);

    return () => clearInterval(interval);
  }, [campaignId, form]);

  useEffect(() => {
    const subject = searchParams.get("subject");
    const senderName = searchParams.get("senderName");
    const senderEmail = searchParams.get("senderEmail");

    if (subject) form.setValue("emailSubject", subject);
    if (senderName) form.setValue("senderName", senderName);
    if (senderEmail) form.setValue("senderEmail", senderEmail);
  }, [form, searchParams]);

  const syncUrlStep = (nextStep: number) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("step", String(nextStep));
    if (campaignId) next.set("campaign", campaignId);
    router.replace(`/campaigns/new?${next.toString()}`);
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof CampaignFormData)[] = [];

    // Define which fields to validate for each step
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["campaignName", "campaignType", "template"];
        break;
      case 2:
        fieldsToValidate = ["selectedAudiences"];
        break;
      case 3:
        fieldsToValidate = ["emailSubject", "senderName", "senderEmail"];
        break;
      case 4:
        fieldsToValidate = ["sendOption"];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (!isValid) return;
    if (!campaignId) {
      if (bootstrapError) {
        toast.error(bootstrapError);
        return;
      }
      toast.error("Campaign is still being created. Try again in a moment.");
      return;
    }

    try {
      if (currentStep === 1) {
        const data = form.getValues();
        await campaignsService.updateCampaign(campaignId, {
          name: data.campaignName,
          type: data.campaignType,
          template: data.template,
        });
      }

      if (currentStep === 2) {
        const data = form.getValues();
        const listIdSet = new Set(CAMPAIGN_LISTS.map((l) => l.id));
        const segmentIdSet = new Set(CAMPAIGN_SEGMENTS.map((s) => s.id));
        const listIds = data.selectedAudiences.filter((id) =>
          listIdSet.has(id)
        );
        const segmentIds = data.selectedAudiences.filter((id) =>
          segmentIdSet.has(id)
        );

        await campaignsService.setAudience(campaignId, { listIds, segmentIds });
        await campaignsService
          .estimateAudience(campaignId)
          .catch(() => undefined);
        await campaignsService.updateTracking(campaignId, {
          smartSending: Boolean(data.smartSending),
          trackingParameters: Boolean(data.trackingParameters),
        });
      }

      if (currentStep === 3) {
        const data = form.getValues();
        await campaignsService.updateContent(campaignId, {
          subject: data.emailSubject,
          previewText: data.previewText,
          senderName: data.senderName,
          senderEmail: data.senderEmail,
          replyToEmail: data.useReplyTo ? data.replyToEmail : undefined,
        });

        if (data.selectedTemplate && data.selectedTemplate.length > 0) {
          await campaignsService.setTemplate(campaignId, {
            templateId: data.selectedTemplate,
          });
        }
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to save step";
      toast.error(message);
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      syncUrlStep(nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const nextStep = currentStep - 1;
      setCurrentStep(nextStep);
      syncUrlStep(nextStep);
    }
  };

  const onSubmit = async (_data: CampaignFormData) => {
    if (!campaignId) {
      toast.error("Missing campaign id.");
      return;
    }

    try {
      const data = form.getValues();
      await campaignsService.updateSchedule(campaignId, {
        sendOption: data.sendOption,
        scheduleDate: data.scheduleDate
          ? data.scheduleDate.toISOString()
          : undefined,
        scheduleTime: data.scheduleTime,
        timezone: data.timezone,
      });

      const validation = await campaignsService.validateCampaign(campaignId);
      if (!validation?.valid) {
        toast.error("Campaign is not ready to launch.");
        return;
      }

      await campaignsService.launchCampaign(campaignId);
      setShowConfirmation(true);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to launch campaign";
      toast.error(message);
    }
  };

  const sendOption = form.watch("sendOption");
  const scheduleDate = form.watch("scheduleDate");
  const scheduleTime = form.watch("scheduleTime");
  const timezone = form.watch("timezone");

  return (
    <div className="min-h-screen bg-background font-sans -mt-[20px] z-2">
      {/* Header with Progress */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <Link href={PRIVATE_ROUTES.CAMPAIGNS}>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl transition-all duration-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to campaigns
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground font-medium">
              Step {currentStep} of {TOTAL_STEPS}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-24 py-4 md:py-6 max-w-6xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="bg-card border border-border rounded-2xl shadow-xl transition-all duration-300">
              {!showConfirmation ? (
                <>
                  {!campaignId && (
                    <div className="border-b border-border p-6 md:p-8 lg:p-10">
                      <div className="text-sm text-muted-foreground">
                        {bootstrapError ?? "Creating campaign draft…"}
                      </div>
                      {bootstrapError && (
                        <div className="mt-4">
                          <Button
                            type="button"
                            onClick={() => {
                              setBootstrapError(null);
                              isBootstrappingInFlightRef.current = false;
                            }}
                            className="rounded-xl"
                          >
                            Retry
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  {currentStep === 1 && <CampaignDetailsStep form={form} />}
                  {currentStep === 2 && <AudienceStep form={form} />}
                  {currentStep === 3 && (
                    <TemplateStep form={form} campaignId={campaignId} />
                  )}
                  {currentStep === 4 && <ScheduleStep form={form} />}

                  {/* Navigation Buttons */}
                  {currentStep !== 3 && (
                    <div className="flex items-center justify-between p-6 md:p-8 lg:p-10 border-t border-border">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="rounded-xl transition-all duration-300 disabled:opacity-50"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>

                      {currentStep === TOTAL_STEPS ? (
                        <Button
                          type="submit"
                          disabled={!campaignId || isBootstrappingCampaign}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]"
                        >
                          {sendOption === "now"
                            ? "Send Campaign Now"
                            : "Schedule Campaign"}
                          {sendOption === "now" ? (
                            <Send className="ml-2 h-4 w-4" />
                          ) : (
                            <Clock className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={handleNext}
                          disabled={!campaignId || isBootstrappingCampaign}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 transition-all duration-300 ease-in-out hover:shadow-lg"
                        >
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Step 3 Navigation (inside TemplateStep component) */}
                  {currentStep === 3 && (
                    <div className="flex items-center justify-between p-6 md:p-8 lg:p-10 border-t border-border">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBack}
                        disabled={isBootstrappingCampaign}
                        className="rounded-xl transition-all duration-300"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>

                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={!campaignId || isBootstrappingCampaign}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 transition-all duration-300 ease-in-out hover:shadow-lg"
                      >
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <ConfirmationPage
                  sendOption={sendOption}
                  scheduleDate={scheduleDate}
                  scheduleTime={scheduleTime}
                  timezone={timezone}
                />
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
