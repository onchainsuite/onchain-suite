import { DashboardLayout } from "@/common/layout";

const DashboardPage = () => {
  const breadcrumbs = [{ label: "Home" }];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>Onchain Suite</DashboardLayout>
  );
};

export default DashboardPage;
