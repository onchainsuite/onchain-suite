import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const templates = [
  "Verification Email",
  "Magic Link",
  "Password Reset",
  "Welcome Email",
];

export function EmailTemplatesList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Templates</CardTitle>
        <CardDescription>
          Customize email templates for different authentication flows
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {templates.map((template) => (
          <div
            key={template}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{template}</p>
                <p className="text-sm text-muted-foreground">
                  Last updated 2 days ago
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Preview
              </Button>
              <Button size="sm">Edit</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
