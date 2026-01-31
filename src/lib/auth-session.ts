import { headers } from "next/headers";

export async function getSession() {
  try {
    const headersList = await headers();
    const cookie = headersList.get("cookie") || "";

    const response = await fetch("https://onchain-backend-dvxw.onrender.com/api/v1/auth/get-session", {
      headers: {
        Cookie: cookie,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    // better-auth usually returns { session: {...}, user: {...} } or null
    if (!data || !data.session || !data.user) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch session:", error);
    return null;
  }
}
