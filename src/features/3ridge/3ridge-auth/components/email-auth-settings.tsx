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

export function EmailAuthSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Settings</CardTitle>
        <CardDescription>
          Configure email authentication behavior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Magic Link Authentication</Label>
            <p className="text-sm text-muted-foreground">
              Allow passwordless login via email
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Verification Required</Label>
            <p className="text-sm text-muted-foreground">
              Require email verification for new accounts
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>zk-Sync Email Verification</Label>
            <p className="text-sm text-muted-foreground">
              Use zero-knowledge proofs for verification
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="space-y-2">
          <Label>Link Expiration (minutes)</Label>
          <Input type="number" defaultValue="15" />
        </div>

        <div className="space-y-2">
          <Label>Max Verification Attempts</Label>
          <Input type="number" defaultValue="3" />
        </div>
      </CardContent>
    </Card>
  );
}
