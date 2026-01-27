import { headers } from "next/headers";

interface Session {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    emailVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    firstName?: string;
    lastName?: string;
    isNewUser?: boolean;
    timezone?: string;
    // Add other fields as needed
    role?: string;
  };
  session: {
    id: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
    userId: string;
  };
}

export async function getSession(): Promise<Session | null> {
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie");

    if (!cookieHeader) {
      return null;
    }

    const backendUrl =
      process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      console.error("BACKEND_URL is not configured");
      return null;
    }

    const response = await fetch(`${backendUrl}/session`, {
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch session:", error);
    return null;
  }
}
