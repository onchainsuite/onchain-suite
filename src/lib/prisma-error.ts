import { type ApiErrorResponse } from "@/types/api";

import { serverEnv } from "./env";
import { Prisma } from "@/prisma/client";

function logError(error: unknown): void {
  if (serverEnv.NODE_ENV === "development") {
    console.error("🔴 Prisma Error:", error);
  } else {
    // TODO: Replace with Winston, Pino, or Sentry logging
    console.error("🔴 Prisma Error (prod):", {
      message: error instanceof Error ? error.message : error,
    });
  }
}

/**
 * Centralized Prisma error handler with automatic logging.
 */
export function handlePrismaError(error: unknown): ApiErrorResponse {
  logError(error); // ✅ always log first

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": // Unique constraint failed
        return {
          isSuccessful: false,
          message: `Duplicate value for field: ${error.meta?.target ?? "unknown field"}`,
          statusCode: 409,
          meta: { code: error.code, target: error.meta?.target },
        };

      case "P2025": // Record not found
        return {
          isSuccessful: false,
          message: "The requested record was not found.",
          statusCode: 404,
          meta: { code: error.code },
        };

      case "P2003": // Foreign key constraint failed
        return {
          isSuccessful: false,
          message: "Cannot perform operation due to related record constraint.",
          statusCode: 400,
          meta: { code: error.code },
        };

      default:
        return {
          isSuccessful: false,
          message: `Database request failed with code ${error.code}.`,
          statusCode: 500,
          meta: { code: error.code },
        };
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      isSuccessful: false,
      message: "Invalid data sent to database.",
      statusCode: 400,
    };
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return {
      isSuccessful: false,
      message: "Database engine encountered a fatal error.",
      statusCode: 500,
    };
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      isSuccessful: false,
      message: "Database connection failed.",
      statusCode: 503,
    };
  }

  return {
    isSuccessful: false,
    message: "An unexpected error occurred.",
    statusCode: 500,
  };
}
