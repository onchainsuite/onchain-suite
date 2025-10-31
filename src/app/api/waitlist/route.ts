import { type NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";

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

    const normalizedMode =
      typeof mode === "string" ? mode.toLowerCase() : "light";

    // Create or ignore duplicate based on unique(product, email)
    const result = await prisma.waitlist.upsert({
      where: {
        product_email: {
          product,
          email,
        },
      },
      update: {
        name: name ?? undefined,
        mode: normalizedMode,
      },
      create: {
        email,
        name: name ?? undefined,
        product,
        mode: normalizedMode,
      },
    });

    return Response.json({
      ok: true,
      message: "You’re on the waitlist!",
      data: { id: result.id },
    });
  } catch (error) {
    console.error("Waitlist POST error", error);
    return Response.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
