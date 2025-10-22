"use server";

import { APIError } from "better-auth/api";

import { auth } from "@/lib/auth";
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
    await auth.api.signUpEmail({
      body: {
        name: getFullName(data.firstName, data.lastName),
        email: data.email,
        password: data.password,
      },
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
