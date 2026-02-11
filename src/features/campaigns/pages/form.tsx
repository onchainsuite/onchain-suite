"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Clock, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Form } from "@/ui/form";

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
import { PRIVATE_ROUTES } from "@/shared/config/app-routes";

const TOTAL_STEPS = 4;

export function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (_data: CampaignFormData) => {
    setShowConfirmation(true);
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
                  {currentStep === 1 && <CampaignDetailsStep form={form} />}
                  {currentStep === 2 && <AudienceStep form={form} />}
                  {currentStep === 3 && <TemplateStep form={form} />}
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
                        className="rounded-xl transition-all duration-300"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>

                      <Button
                        type="button"
                        onClick={handleNext}
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
