"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/ui/alert-dialog";

import { campaignsService } from "../../../campaigns/campaigns.service";
import type { Campaign } from "../../../campaigns/types";
import { PRIVATE_ROUTES } from "@/shared/config/app-routes";

interface CampaignActionsCellProps {
  campaign: Campaign;
}

export function CampaignActionsCell({ campaign }: CampaignActionsCellProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const campaignWizardBaseUrl = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("campaign", campaign.id);
    return `${PRIVATE_ROUTES.NEW_CAMPAIGN}?${qs.toString()}`;
  }, [campaign.id]);

  const openWizardStep = (step: number) => {
    const url = new URL(campaignWizardBaseUrl, "http://localhost");
    url.searchParams.set("step", String(step));
    router.push(`${url.pathname}?${url.searchParams.toString()}`);
  };

  const duplicateMutation = useMutation({
    mutationFn: () => campaignsService.duplicateCampaign(campaign.id),
    onSuccess: async (created) => {
      toast.success("Campaign duplicated");
      await queryClient.invalidateQueries({ queryKey: ["campaigns", "list"] });
      await queryClient.invalidateQueries({
        queryKey: ["campaigns", "calendar"],
      });
      if (created?.id) {
        const nextUrl = new URL(
          PRIVATE_ROUTES.NEW_CAMPAIGN,
          "http://localhost"
        );
        nextUrl.searchParams.set("campaign", created.id);
        nextUrl.searchParams.set("step", "1");
        router.push(`${nextUrl.pathname}?${nextUrl.searchParams.toString()}`);
      } else {
        toast.error("Failed to open duplicated campaign");
      }
    },
    onError: (e: unknown) => {
      toast.error(
        e instanceof Error ? e.message : "Failed to duplicate campaign"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => campaignsService.deleteCampaign(campaign.id),
    onSuccess: async () => {
      toast.success("Campaign deleted");
      setDeleteOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["campaigns", "list"] });
      await queryClient.invalidateQueries({
        queryKey: ["campaigns", "calendar"],
      });
    },
    onError: (e: unknown) => {
      toast.error(e instanceof Error ? e.message : "Failed to delete campaign");
    },
  });

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(campaign.id);
      toast.success("Campaign ID copied");
    } catch {
      toast.error("Failed to copy campaign ID");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleCopyId}>Copy ID</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => openWizardStep(4)}>
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openWizardStep(1)}>
            Edit campaign
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => duplicateMutation.mutate()}
            disabled={duplicateMutation.isPending}
          >
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => setDeleteOpen(true)}
            disabled={deleteMutation.isPending}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {campaign.name ? `"${campaign.name}"` : "this campaign"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
