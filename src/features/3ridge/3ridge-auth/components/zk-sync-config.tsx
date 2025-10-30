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
import { Switch } from "@/components/ui/switch";

interface ZKSyncConfigProps {
  title: string;
  description: string;
  authType: "email" | "oauth" | "biometric";
}

export function ZKSyncConfig({
  title,
  description,
  authType,
}: ZKSyncConfigProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>
              Enable zk-Sync for{" "}
              {authType === "email"
                ? "Email"
                : authType === "oauth"
                  ? "OAuth"
                  : "Biometrics"}
            </Label>
            <p className="text-sm text-muted-foreground">
              Use zero-knowledge proofs for verification
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>
              Privacy-Preserving{" "}
              {authType === "biometric" ? "Matching" : "Verification"}
            </Label>
            <p className="text-sm text-muted-foreground">
              {authType === "biometric"
                ? "Match biometrics without exposing templates"
                : "Verify without exposing details"}
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        {authType === "biometric" && (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Homomorphic Encryption</Label>
              <p className="text-sm text-muted-foreground">
                Perform matching on encrypted biometric data
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        )}

        {authType === "oauth" && (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Cross-Provider Verification</Label>
              <p className="text-sm text-muted-foreground">
                Link multiple OAuth accounts with zk-proofs
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        )}

        <div className="space-y-2">
          <Label>
            {authType === "email" ? "zk-Circuit Type" : "zk-Proof System"}
          </Label>
          <Select defaultValue="groth16">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="groth16">Groth16</SelectItem>
              <SelectItem value="plonk">PLONK</SelectItem>
              <SelectItem
                value={authType === "biometric" ? "bulletproofs" : "stark"}
              >
                {authType === "biometric" ? "Bulletproofs" : "STARK"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {authType === "biometric" && (
          <div className="space-y-2">
            <Label>Template Encryption Algorithm</Label>
            <Select defaultValue="aes256">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aes256">AES-256-GCM</SelectItem>
                <SelectItem value="chacha20">ChaCha20-Poly1305</SelectItem>
                <SelectItem value="homomorphic">
                  Homomorphic Encryption
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Verification Endpoint</Label>
          <Input defaultValue={`https://api.3ridge.io/zk/${authType}/verify`} />
        </div>

        {authType === "oauth" && (
          <div className="space-y-2">
            <Label>Proof Caching Duration (hours)</Label>
            <Input type="number" defaultValue="48" />
          </div>
        )}

        <Button className="w-full">Save zk-Sync Configuration</Button>
      </CardContent>
    </Card>
  );
}
