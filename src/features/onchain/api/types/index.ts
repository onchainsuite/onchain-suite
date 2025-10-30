export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiEndpoint {
  path: string;
  method: HttpMethod;
  description: string;
  rateLimit: string;
}
