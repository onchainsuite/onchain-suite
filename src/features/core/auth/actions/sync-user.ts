"use server";

import { getAuthSession } from "@/lib/guard";
import { getFullName } from "@/lib/utils";

import { type SignUpFormData } from "@/auth/validation";
import { redirect } from "next/navigation";

interface UserSyncResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

export async function getAuthenticatedUserId(): Promise<string> {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }
  return session.user.id;
}

export async function syncUserDataWithGuard(
  userData: SignUpFormData
): Promise<UserSyncResult> {
  try {
    // Use the auth guard - will redirect if not authenticated
    const session = await getAuthSession();

    if (!session) {
      return {
        success: false,
        error: "Authentication required",
        redirectTo: "/",
      };
    }
    const { user } = session;

    // TODO: Implement API call to sync user data with Render backend
    // await apiClient.post('/users/sync', {
    //   id: user.id,
    //   email: userData.email ?? user.email,
    //   name: getFullName(userData.firstName, userData.lastName),
    //   firstName: userData.firstName,
    //   lastName: userData.lastName,
    // });
    
    console.log("Syncing user data (mock):", {
      id: user.id,
      email: userData.email ?? user.email,
      name: getFullName(userData.firstName, userData.lastName),
    });

    return { success: true };
  } catch (error) {
    console.error("User sync error:", error);
    return {
      success: false,
      error: "Failed to sync user data",
    };
  }
}
