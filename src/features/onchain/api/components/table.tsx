import { v7 } from "uuid";

import { Badge } from "@/components/ui/badge";

import { type ApiEndpoint, type HttpMethod } from "../types";

interface EndpointRowProps {
  endpoint: ApiEndpoint;
}

function EndpointRow({ endpoint }: EndpointRowProps) {
  const getMethodVariant = (method: HttpMethod): "secondary" | "default" => {
    return method === "GET" ? "secondary" : "default";
  };

  const getMethodClassName = (method: HttpMethod): string => {
    return method === "POST" ? "bg-green-600" : "";
  };

  return (
    <tr className="border-b">
      <td className="p-4 font-mono text-sm">{endpoint.path}</td>
      <td className="p-4">
        <Badge
          variant={getMethodVariant(endpoint.method)}
          className={getMethodClassName(endpoint.method)}
        >
          {endpoint.method}
        </Badge>
      </td>
      <td className="p-4 text-muted-foreground">{endpoint.description}</td>
      <td className="p-4">
        <Badge variant="outline">{endpoint.rateLimit}</Badge>
      </td>
    </tr>
  );
}

export function EndpointsTable({ endpoints }: { endpoints: ApiEndpoint[] }) {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-4 text-left text-sm font-medium">Endpoint</th>
            <th className="p-4 text-left text-sm font-medium">Method</th>
            <th className="p-4 text-left text-sm font-medium">Description</th>
            <th className="p-4 text-left text-sm font-medium">Rate Limit</th>
          </tr>
        </thead>
        <tbody>
          {endpoints.map((endpoint) => (
            <EndpointRow key={v7()} endpoint={endpoint} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
