"use client";

import { useSearchParams } from "next/navigation";

import { NewUserDashboardPage } from "./new-user.page";
import { ReturningUserCommunity } from "./returning-user.page";

export const CommunityDashboard = () => {
  const searchParams = useSearchParams();
  const isNewUser = searchParams.get("newUser") === "true";

  return isNewUser ? <NewUserDashboardPage /> : <ReturningUserCommunity />;
};
