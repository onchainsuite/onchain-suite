import { MainDashboard } from "@/common/dashboard/page";
import { DashboardLayout } from "@/common/layout";

const DashboardPage = () => {
  const breadcrumbs = [{ label: "Home" }];

  const userData = {
    projectName: "YieldFarm DAO",
    userType: "DeFi" as const,
    trialDaysLeft: 7,
    isNewUser: true,
    subscriptionTier: "free_trial" as const,
  };

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <MainDashboard userData={userData} />
    </DashboardLayout>
  );
};

export default DashboardPage;
