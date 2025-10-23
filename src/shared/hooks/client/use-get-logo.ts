import { useTheme } from "next-themes";

export const useGetLogo = () => {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const logoIcon = isDark
    ? "https://res.cloudinary.com/dwnkqkx8q/image/upload/v1761094220/onchain_light_wylceb.png"
    : "https://res.cloudinary.com/dwnkqkx8q/image/upload/v1761093444/onchain_suite_bf926w.png";

  const fullLogo = isDark
    ? "https://res.cloudinary.com/dwnkqkx8q/image/upload/v1761095267/full_logo_horizontal_coloured_light_kl0irx.png"
    : "https://res.cloudinary.com/dwnkqkx8q/image/upload/v1761095341/full_logo_horizontal_coloured_dark_kpiv6u.png";

  return { logoIcon, fullLogo };
};
