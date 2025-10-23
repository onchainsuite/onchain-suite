import { Button as BaseButton } from "@react-email/components";

export const Button = ({ href, label }: { href: string; label: string }) => (
  <BaseButton
    href={href}
    className="bg-[#1727E0] text-white px-6 py-3 rounded-md font-medium no-underline"
  >
    {label}
  </BaseButton>
);
