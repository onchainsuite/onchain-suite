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
import { Switch } from "@/components/ui/switch";

export function OAuthConfigSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>OAuth Configuration</CardTitle>
        <CardDescription>
          Global settings for OAuth authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Allow Account Linking</Label>
            <p className="text-sm text-muted-foreground">
              Let users link multiple OAuth providers
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto-Create Accounts</Label>
            <p className="text-sm text-muted-foreground">
              Automatically create accounts on first OAuth login
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Request Email Verification</Label>
            <p className="text-sm text-muted-foreground">
              Require email verification after OAuth signup
            </p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Sync Profile Data</Label>
            <p className="text-sm text-muted-foreground">
              Automatically sync profile info from OAuth providers
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="space-y-2">
          <Label>Session Duration (hours)</Label>
          <Input type="number" defaultValue="24" />
        </div>

        <div className="space-y-2">
          <Label>Allowed Domains (comma-separated)</Label>
          <Input placeholder="example.com, company.io" />
        </div>

        <Button className="w-full">Save Configuration</Button>
      </CardContent>
    </Card>
  );
}
