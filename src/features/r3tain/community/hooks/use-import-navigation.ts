"use client";

import { useRouter } from "next/navigation";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import { useImport } from "@/r3tain/community/context";

export function useImportNavigation() {
  const router = useRouter();
  const { resetImport } = useImport();

  const navigateToStep = (step: string, params?: Record<string, string>) => {
    const searchParams = new URLSearchParams(params ?? {});
    const fullUrl = new URL(
      `${PRIVATE_ROUTES.R3TAIN.ADD_SUBSCRIBERS}/${step}?${searchParams}`,
      window.location.origin
    );
    router.push(fullUrl.toString());
  };

  const goBack = (previousStep: string) => {
    router.push(`${PRIVATE_ROUTES.R3TAIN.ADD_SUBSCRIBERS}/${previousStep}`);
  };

  const exitImport = () => {
    resetImport();
    router.push(PRIVATE_ROUTES.R3TAIN.COMMUNITY);
  };

  const goToDashboard = () => {
    resetImport();
    router.push(PRIVATE_ROUTES.R3TAIN.COMMUNITY);
  };

  return {
    navigateToStep,
    goBack,
    exitImport,
    goToDashboard,
  };
}
