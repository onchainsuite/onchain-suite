import { ProtectedLayout } from "@/lib/guard";

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
