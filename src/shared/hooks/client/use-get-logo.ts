import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useGetLogo = () => {
  const { data: branding } = useSWR("/api/v1/organization/branding", fetcher);

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
    lightIcon: primaryLogo || defaultLogos.lightIcon,
    darkIcon: darkModeLogo || defaultLogos.darkIcon,
    lightFull: primaryLogo || defaultLogos.lightFull,
    darkFull: darkModeLogo || defaultLogos.darkFull,
    favicon: favicon || defaultLogos.lightIcon,
  };
};
