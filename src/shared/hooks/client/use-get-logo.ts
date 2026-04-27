import useSWR from "swr";

import { authClient } from "@/lib/auth-client";
import { isOrganizationConfirmed } from "@/lib/utils";

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

  const { primaryLogo, darkModeLogo, favicon } = branding.data;

  return {
    lightIcon: primaryLogo ?? defaultLogos.lightIcon,
    darkIcon: darkModeLogo ?? defaultLogos.darkIcon,
    lightFull: primaryLogo ?? defaultLogos.lightFull,
    darkFull: darkModeLogo ?? defaultLogos.darkFull,
    favicon: favicon ?? defaultLogos.lightIcon,
  };
};
