"use server";

import { APIError } from "better-auth/api";

import { auth } from "@/lib/auth";
import { getAuthSession } from "@/lib/guard";
import { getFullName } from "@/lib/utils";

import { type SignInFormData, type SignUpFormData } from "@/auth/validation";

export const signIn = async (data: SignInFormData) => {
  try {
    await auth.api.signInEmail({
      body: data,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof APIError) {
      return {
        error: error.message,
        status: error.status,
      };
    }
  }
};

export const signUp = async (data: SignUpFormData) => {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: getFullName(data.firstName, data.lastName),
        email: data.email,
        password: data.password,
      },
    });
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.message,
        status: error.status,
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
};

/**
 * Helper to get authenticated user ID
 */
export async function getAuthenticatedUserId(): Promise<string> {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("User not authenticated");
  }
  return session.user.id;
}
