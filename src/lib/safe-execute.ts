import { ZodError } from "zod";

import type {
  PaginatedResponse,
  SafeExecuteResponse,
  SafePaginatedResponse,
} from "@/types/api";

export async function safeExecute<T>(
  action: () => Promise<T>,
  successMessage?: string
): Promise<SafeExecuteResponse<T>> {
  try {
    const data = await action();

    return {
      isSuccessful: true,
      data,
      message: successMessage ?? "Operation successful",
      statusCode: 200,
    };
  } catch (error) {
    // ✅ Handle Zod validation errors gracefully
    if (error instanceof ZodError) {
      return {
        isSuccessful: false,
        message: "Validation failed",
        statusCode: 400,
        meta: {
          issues: error.issues.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
      };
    }

    // ✅ Handle generic errors
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return {
      isSuccessful: false,
      message,
      statusCode: 500,
    };
  }
}

export async function safePaginatedExecute<T>(
  action: () => Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
  }>,
  successMessage?: string
): Promise<SafePaginatedResponse<T>> {
  try {
    const { data, total, page, limit } = await action();

    const pageCount = Math.ceil(total / limit);
    const hasNextPage = page < pageCount;
    const hasPrevPage = page > 1;

    const paginatedResponse: PaginatedResponse<T> = {
      data,
      meta: {
        total,
        page,
        pageSize: limit,
        pageCount,
        hasNextPage,
        hasPrevPage,
      },
    };

    return {
      isSuccessful: true,
      result: paginatedResponse,
      message: successMessage ?? "Operation successful",
    };
  } catch (error) {
    // ✅ Handle Zod validation errors gracefully
    if (error instanceof ZodError) {
      return {
        isSuccessful: false,
        message: "Validation failed",
        statusCode: 400,
        meta: {
          issues: error.issues.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
      };
    }

    // ✅ Handle generic errors
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return {
      isSuccessful: false,
      message,
      statusCode: 500,
    };
  }
}
