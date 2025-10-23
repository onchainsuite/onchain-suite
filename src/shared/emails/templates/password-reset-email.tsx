import { Text } from "@react-email/components";

import { BaseLayout, Button } from "../components";

export const PasswordResetEmail = ({
  name,
  resetUrl,
}: {
  name: string;
  resetUrl: string;
}) => (
  <BaseLayout title="Password Reset Request">
    <Text className="text-lg font-semibold mb-3">Hi {name},</Text>
    <Text className="text-gray-700 mb-6 leading-relaxed">
      We received a request to reset your password. Click the button below to
      set a new one. This link will expire in 30 minutes.
    </Text>

    <Button href={resetUrl} label="Reset Password" />

    <Text className="text-gray-500 mt-6 text-sm">
      If you didn’t request this, you can safely ignore this email.
    </Text>
  </BaseLayout>
);
