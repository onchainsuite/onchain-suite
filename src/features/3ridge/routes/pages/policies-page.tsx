import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  AccessControlTab,
  CreatePolicyTab,
  PageHeader,
  PoliciesTab,
  SecurityRulesTab,
  StatsOverview,
} from "@/3ridge/routes/components";
import { mockPolicies } from "@/3ridge/routes/data";

export function PoliciesPage() {
  return (
    <div className="space-y-6">
      <PageHeader />
      <StatsOverview />

      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="policies" className="whitespace-nowrap">
            Policies
          </TabsTrigger>
          <TabsTrigger value="security" className="whitespace-nowrap">
            Security Rules
          </TabsTrigger>
          <TabsTrigger value="access" className="whitespace-nowrap">
            Access Control
          </TabsTrigger>
          <TabsTrigger value="create" className="whitespace-nowrap">
            Create Policy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <PoliciesTab policies={mockPolicies} />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecurityRulesTab />
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <AccessControlTab />
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <CreatePolicyTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
