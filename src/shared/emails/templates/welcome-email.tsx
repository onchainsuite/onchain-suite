import { Text } from "@react-email/components";

import { BaseLayout, Button } from "../components";

export const WelcomeEmail = ({ name }: { name: string }) => (
  <BaseLayout title="Welcome to Onchain Suite!">
    <Text className="text-lg font-semibold mb-3">
      Hi {name}, welcome aboard! 👋
    </Text>
    <Text className="text-gray-700 mb-6 leading-relaxed">
      We’re thrilled to have you on board. Explore the Onchain Suite dashboard
      to get started with your account and unlock all features designed for your
      business success.
    </Text>

    <Button href="https://onchainsuite.com/dashboard" label="Go to Dashboard" />

    <Text className="text-gray-500 mt-6 text-sm">
      Need help? Visit our{" "}
      <a
        href="https://onchainsuite.com/support"
        className="text-[#2F94FF] underline"
      >
        Support Center
      </a>
      .
    </Text>
  </BaseLayout>
);
