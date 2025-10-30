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

export function ZKSyncConfigForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>zk-Sync Configuration</CardTitle>
        <CardDescription>
          Configure zero-knowledge proof verification for wallet authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable zk-Sync Verification</Label>
            <p className="text-sm text-muted-foreground">
              Require zero-knowledge proofs for all wallet connections
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Automatic Proof Generation</Label>
            <p className="text-sm text-muted-foreground">
              Generate proofs automatically on connection
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Proof Caching</Label>
            <p className="text-sm text-muted-foreground">
              Cache verified proofs for faster subsequent logins
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="space-y-2">
          <Label>Proof Validity Period (hours)</Label>
          <Input type="number" defaultValue="24" />
        </div>

        <div className="space-y-2">
          <Label>Verification Endpoint</Label>
          <Input defaultValue="https://api.3ridge.io/zk/verify" />
        </div>

        <Button className="w-full">Save Configuration</Button>
      </CardContent>
    </Card>
  );
}
