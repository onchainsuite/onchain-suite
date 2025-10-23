import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

export const BaseLayout = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="bg-[#F0F7FF] text-[#010F31] font-sans">
        <Container className="mx-auto max-w-[600px] bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
          {/* Header */}
          <Section className="bg-[#010F31] text-white text-center py-4">
            <Img
              src="https://res.cloudinary.com/dwnkqkx8q/image/upload/v1761095341/full_logo_horizontal_coloured_dark_kpiv6u.png"
              alt="Onchain Suite"
              className="mx-auto w-[160px] h-auto"
            />
            {title && <Text className="text-sm opacity-80 mt-2">{title}</Text>}
          </Section>

          {/* Content */}
          <Section className="px-8 py-6">{children}</Section>

          {/* Footer */}
          <Hr className="border-t border-gray-200 mt-6 mb-3" />
          <Section className="text-center text-xs text-gray-500 pb-6">
            <Text>
              © {new Date().getFullYear()} Onchain Suite. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
