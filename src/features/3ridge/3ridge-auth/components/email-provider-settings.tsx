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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EmailProviderSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Provider</CardTitle>
        <CardDescription>Configure your email service provider</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Provider</Label>
          <Select defaultValue="sendgrid">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sendgrid">SendGrid</SelectItem>
              <SelectItem value="ses">Amazon SES</SelectItem>
              <SelectItem value="mailgun">Mailgun</SelectItem>
              <SelectItem value="postmark">Postmark</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>API Key</Label>
          <Input type="password" placeholder="••••••••••••••••" />
        </div>

        <div className="space-y-2">
          <Label>From Email</Label>
          <Input defaultValue="noreply@3ridge.io" />
        </div>

        <div className="space-y-2">
          <Label>From Name</Label>
          <Input defaultValue="3ridge" />
        </div>

        <Button className="w-full">Save Provider Settings</Button>
      </CardContent>
    </Card>
  );
}
