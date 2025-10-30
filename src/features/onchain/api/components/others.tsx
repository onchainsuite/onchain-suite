import { Copy, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { exampleRequest, exampleResponse } from "../data";

interface ApiKeyInputProps {
  apiKey: string;
  showApiKey: boolean;
  onToggleVisibility: () => void;
  onCopy: () => void;
}

interface CodeBlockProps {
  code: string;
  onCopy: () => void;
}

function ApiKeyInput({
  apiKey,
  showApiKey,
  onToggleVisibility,
  onCopy,
}: ApiKeyInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="apiKey">API Key</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="apiKey"
            type={showApiKey ? "text" : "password"}
            value={apiKey}
            readOnly
            className="font-mono"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            onClick={onToggleVisibility}
          >
            {showApiKey ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Button
          variant="outline"
          className="gap-2 bg-transparent"
          onClick={onCopy}
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
      </div>
    </div>
  );
}

function CodeBlock({ code, onCopy }: CodeBlockProps) {
  return (
    <div className="relative">
      <pre className="p-4 rounded-lg bg-secondary overflow-x-auto">
        <code className="text-sm font-mono">{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={onCopy}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function ApiAuthenticationCard({
  apiKey,
  showApiKey,
  onToggleVisibility,
  onCopy,
}: {
  apiKey: string;
  showApiKey: boolean;
  onToggleVisibility: () => void;
  onCopy: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Authentication</CardTitle>
        <CardDescription>
          Manage your API keys and authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ApiKeyInput
          apiKey={apiKey}
          showApiKey={showApiKey}
          onToggleVisibility={onToggleVisibility}
          onCopy={onCopy}
        />
        <p className="text-sm text-muted-foreground">
          Include this key in the Authorization header of your API requests
        </p>
      </CardContent>
    </Card>
  );
}

export function ExampleUsageCard({ onCopy }: { onCopy: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Usage</CardTitle>
        <CardDescription>Sample request and response</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="request">
          <TabsList>
            <TabsTrigger value="request">Request</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
          </TabsList>
          <TabsContent value="request" className="mt-4">
            <CodeBlock code={exampleRequest} onCopy={onCopy} />
          </TabsContent>
          <TabsContent value="response" className="mt-4">
            <CodeBlock code={exampleResponse} onCopy={onCopy} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
