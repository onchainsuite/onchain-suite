import { Building2 } from "lucide-react";

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

export function OrganizationSettingsTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <CardTitle>Organization Settings</CardTitle>
        </div>
        <CardDescription>Manage your organization details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Organization Name</Label>
          <Input defaultValue="OnchainSuite" />
        </div>

        <div className="space-y-2">
          <Label>Organization ID</Label>
          <Input defaultValue="org_onchainsuite_2024" disabled />
        </div>

        <div className="space-y-2">
          <Label>Website</Label>
          <Input defaultValue="https://onchainsuite.com" />
        </div>

        <div className="space-y-2">
          <Label>Support Email</Label>
          <Input type="email" defaultValue="support@onchainsuite.com" />
        </div>

        <div className="space-y-2">
          <Label>Company Size</Label>
          <Select defaultValue="11-50">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 employees</SelectItem>
              <SelectItem value="11-50">11-50 employees</SelectItem>
              <SelectItem value="51-200">51-200 employees</SelectItem>
              <SelectItem value="201+">201+ employees</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Industry</Label>
          <Select defaultValue="web3">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web3">Web3 / Blockchain</SelectItem>
              <SelectItem value="fintech">Fintech</SelectItem>
              <SelectItem value="saas">SaaS</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full">Save Organization Settings</Button>
      </CardContent>
    </Card>
  );
}
