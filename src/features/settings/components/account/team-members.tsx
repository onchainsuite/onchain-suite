import { motion } from "framer-motion";
import { Plus, ShieldCheck, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";

import { fadeInUp, staggerContainer } from "../../utils";

interface TeamMembersProps {
  setShowInviteUserModal: (show: boolean) => void;
}

const TeamMembers = ({ setShowInviteUserModal }: TeamMembersProps) => {
  const { data: session } = authClient.useSession();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (session?.session?.activeOrganizationId) {
        setLoading(true);
        try {
          // Use authClient to fetch members if possible, otherwise use action
          const orgId = session.session.activeOrganizationId;
          const membersData = await authClient.organization.listMembers({
              query: {
                  limit: 100
              }
          });
          if (membersData.data) {
              setMembers(membersData.data.members);
          }
        } catch (error) {
          console.error("Failed to fetch members", error);
        } finally {
            setLoading(false);
        }
      }
    };
    fetchMembers();
  }, [session]);

  const handleRoleChange = async (memberId: string, newRole: string) => {
    if (!session?.session?.activeOrganizationId) return;
    try {
        await authClient.organization.updateMemberRole({
            organizationId: session.session.activeOrganizationId,
            memberId,
            role: newRole as any
        });
        toast.success("Role updated");
        // Refresh members list ideally
    } catch (error) {
        toast.error("Failed to update role");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
      if (!session?.session?.activeOrganizationId) return;
      try {
          await authClient.organization.removeMember({
              organizationId: session.session.activeOrganizationId,
              memberIdOrEmail: memberId
          });
          toast.success("Member removed");
          setMembers(members.filter(m => m.id !== memberId));
      } catch (error) {
          toast.error("Failed to remove member");
      }
  };

  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <motion.h2
            variants={fadeInUp}
            className="text-xl font-light tracking-tight text-foreground lg:text-2xl"
          >
            Team members
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-3 text-muted-foreground">
            Manage team access and permissions
          </motion.p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => setShowInviteUserModal(true)}
            className="h-11 bg-primary px-6 text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/10"
          >
            <Plus className="mr-2 h-4 w-4" />
            Invite user
          </Button>
        </motion.div>
      </div>

      <motion.div
        variants={fadeInUp}
        className="mt-8 border-t border-border/60 pt-8 lg:mt-10 lg:pt-10"
      >
        {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading members...</div>
        ) : (
        <>
        {/* Desktop table */}
        <div className="hidden space-y-3 lg:block">
          <div className="grid grid-cols-5 gap-4 px-6 py-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-2">User</div>
            <div>Status</div>
            <div>Role</div>
            <div className="text-right">Actions</div>
          </div>
          {members.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{
                y: -2,
                boxShadow: "0 25px 50px -12px rgba(var(--primary-rgb), 0.08)",
              }}
              className="group grid grid-cols-5 items-center gap-4 rounded-xl border border-border/60 bg-card px-6 py-5 transition-all duration-300"
              style={{ minHeight: "80px" }}
            >
              <div className="col-span-2 flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20">
                  <span className="text-sm font-medium text-primary">
                    {member.user?.name?.charAt(0) || member.user?.email?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{member.user?.name || "Unknown"}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {member.user?.email}
                  </p>
                </div>
              </div>
              <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1.5 text-xs font-medium text-primary">
                    Active
                  </span>
              </div>
              <div>
                <Select
                  defaultValue={member.role}
                  onValueChange={(val) => handleRoleChange(member.id, val)}
                >
                    <SelectTrigger className="h-9 w-32 border-border/80 bg-background/50">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                      <Trash2 className="h-4 w-4" />
                  </Button>
              </div>
            </motion.div>
          ))}
        </div>
        </>
        )}
      </motion.div>
    </motion.section>
  );
};

export default TeamMembers;
