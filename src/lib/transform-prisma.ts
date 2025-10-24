import { Decimal } from "@/prisma/internal/prismaNamespace";

/**
 * Recursively transforms Prisma models by:
 * - Converting Decimal to number
 * - Converting Date to ISO string
 * - Recursively transforming arrays and nested objects
 */
export function transformPrisma<T>(data: T): T {
  if (data === null || data === undefined) return data;

  // Handle Prisma Decimal
  if (data instanceof Decimal) {
    return data.toNumber() as unknown as T;
  }

  // Handle Dates
  if (data instanceof Date) {
    return data.toISOString() as unknown as T;
  }

  // Handle Arrays
  if (Array.isArray(data)) {
    return data.map((item) => transformPrisma(item)) as unknown as T;
  }

  // Handle Objects (recursively)
  if (typeof data === "object") {
    return Object.entries(data).reduce((acc, [key, value]) => {
      (acc as Record<string, unknown>)[key] = transformPrisma(value);
      return acc;
    }, {} as T);
  }

  // Primitives (string, number, boolean)
  return data;
}
