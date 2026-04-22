import { type NextRequest, NextResponse } from "next/server";

import { VerificationService } from "@/auth/verification.service";

/**
 * GET /api/v1/auth/verify-email?token=...
 *
 * Verifies a user's email address using a secure token flow.
 * 1. Extract token from URL.
 * 2. Validate token (selector/verifier hashing check).
 * 3. Update user as verified.
 * 4. Cleanup used token.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Verification token is required" },
      { status: 400 }
    );
  }

  try {
    // 1. Verification Logic
    const result = await VerificationService.verifyEmail(token);

    // 2. Return success response
    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      data: result,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error && error.message.length > 0
        ? error.message
        : String(error);
    console.error("Email verification error details:", {
      message,
      stack: error instanceof Error ? error.stack : undefined,
      token: `${token.substring(0, 10)}...`,
    });

    // Handle specific error cases (expired, invalid format, etc.)
    const status = message.includes("expired") ? 410 : 400;

    return NextResponse.json(
      {
        success: false,
        message: message.length > 0 ? message : "Email verification failed",
      },
      { status }
    );
  }
}
