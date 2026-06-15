import useSWR from "swr";

import { authClient } from "@/lib/auth-client";
import { isOrganizationConfirmed } from "@/lib/utils";

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return undefined;
};

export const readBrandingData = (branding: unknown) => {
  const root =
    branding &&
    typeof branding === "object" &&
    "success" in branding &&
    "data" in branding
      ? (branding as { success?: boolean; data?: Record<string, unknown> }).data
      : undefined;
  const data = root && typeof root === "object" ? root : undefined;
  const preview =
    data?.logoPreview && typeof data.logoPreview === "object"
      ? (data.logoPreview as Record<string, unknown>)
      : undefined;

  return {
    primary: pickString(
      preview?.primaryUrl,
      data?.primaryLogoUrl,
      data?.primaryLogo,
      data?.logoUrl,
      data?.logo
    ),
    dark: pickString(
      preview?.darkUrl,
      data?.darkLogoUrl,
      data?.darkModeLogo,
      data?.darkLogo
    ),
    favicon: pickString(preview?.faviconUrl, data?.faviconUrl, data?.favicon),
  };
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) return { success: false, status: res.status };
  try {
    return await res.json();
  } catch {
    return { success: false };
  }
};

export const useGetLogo = () => {
  const { data: session } = authClient.useSession();
  const activeOrganizationId = session?.session?.activeOrganizationId ?? null;
  const confirmed = isOrganizationConfirmed(activeOrganizationId);
  const { data: branding } = useSWR(
    confirmed ? "/api/v1/organization/branding" : null,
    fetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  const defaultLogos = {
    lightIcon:
      "https://res.cloudinary.com/dwnkqkx8q/image/upload/v1761093444/onchain_suite_bf926w.png",
    darkIcon:
      "https://res.cloudinary.com/dwnkqkx8q/image/upload/v1761094220/onchain_light_wylceb.png",
    lightFull:
      "https://res.cloudinary.com/dwnkqkx8q/image/upload/v1761095341/full_logo_horizontal_coloured_dark_kpiv6u.png",
    darkFull:
      "https://res.cloudinary.com/dwnkqkx8q/image/upload/v1761095267/full_logo_horizontal_coloured_light_kl0irx.png",
  };

  if (!branding?.success || !branding?.data) {
    return defaultLogos;
  }

  const { primary, dark, favicon } = readBrandingData(branding);

  return {
    lightIcon: primary ?? defaultLogos.lightIcon,
    darkIcon: dark ?? defaultLogos.darkIcon,
    lightFull: primary ?? defaultLogos.lightFull,
    darkFull: dark ?? defaultLogos.darkFull,
    favicon: favicon ?? primary ?? defaultLogos.lightIcon,
  };
};
