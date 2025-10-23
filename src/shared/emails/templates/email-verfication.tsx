import { Text } from "@react-email/components";

import { BaseLayout, Button } from "../components";

export const EmailVerificationEmail = ({
  name,
  verifyUrl,
}: {
  name?: string;
  verifyUrl: string;
}) => (
  <BaseLayout title="Account Verification">
    <Text className="text-lg font-semibold mb-3">
      Hi {name ?? "there"}, welcome to Onchain Suite 👋
    </Text>

    <Text className="text-gray-700 mb-6 leading-relaxed">
      Before you can start exploring your dashboard, please confirm that this is
      your email address. Click the button below to verify your account.
    </Text>

    <Button href={verifyUrl} label="Verify Email" />

    <Text className="text-gray-500 mt-6 text-sm">
      If you didn’t create an account with Onchain Suite, you can safely ignore
      this message.
    </Text>
  </BaseLayout>
);
