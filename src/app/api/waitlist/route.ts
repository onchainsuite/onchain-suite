import { type NextRequest } from "next/server";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, product, mode } = body ?? {};

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return Response.json(
        { ok: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!product || typeof product !== "string") {
      return Response.json(
        { ok: false, error: "Product is required." },
        { status: 400 }
      );
    }

    // TODO: Implement API call to submit waitlist to Render backend
    // await apiClient.post('/waitlist', { email, name, product, mode });

    console.log("Waitlist submission (mock):", { email, name, product, mode });

    return Response.json({
      ok: true,
      message: "You’re on the waitlist!",
      data: { id: "mock-id" },
    });
  } catch (error) {
    console.error("Waitlist POST error", error);
    return Response.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
