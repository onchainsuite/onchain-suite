import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import { fadeInUp, staggerContainer } from "../../utils";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface TeamMembersProps {
  setShowInviteUserModal: (show: boolean) => void;
  refreshTrigger?: number;
}

const TeamMembers = ({
  setShowInviteUserModal,
  refreshTrigger,
}: TeamMembersProps) => {
  const { data: session } = authClient.useSession();
  const [members, setMembers] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembersAndInvites = async () => {
      if (session?.session?.activeOrganizationId) {
        setLoading(true);
        try {
          const orgId = session.session.activeOrganizationId;

          const [membersData, invitesData] = await Promise.all([
            authClient.organization.listMembers({
              query: { limit: 100 },
              fetchOptions: { headers: { "x-org-id": orgId } },
            }),
            authClient.organization
              .listInvitations({
                fetchOptions: { headers: { "x-org-id": orgId } },
              })
              .catch(() => ({ data: [] })), // Fallback if not supported or fails
          ]);

          if (membersData.data) {
            setMembers(membersData.data.members);
          }
          if (invitesData && invitesData.data) {
            setInvites(invitesData.data);
          }
        } catch (error) {
          console.error("Failed to fetch members/invites", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMembersAndInvites();
  }, [session, refreshTrigger]);

  const handleRoleChange = async (memberId: string, newRole: string) => {
    if (!session?.session?.activeOrganizationId) return;
    try {
      await authClient.organization.updateMemberRole(
        {
          organizationId: session.session.activeOrganizationId,
          memberId,
          role: newRole as any,
        },
        {
          headers: {
            "x-org-id": session.session.activeOrganizationId,
          },
        }
      );
      toast.success("Role updated");
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleRemove = async (id: string, type: "member" | "invite") => {
    if (!session?.session?.activeOrganizationId) return;
    try {
      if (type === "member") {
        await authClient.organization.removeMember(
          {
            organizationId: session.session.activeOrganizationId,
            memberIdOrEmail: id,
          },
          {
            headers: {
              "x-org-id": session.session.activeOrganizationId,
            },
          }
        );
        toast.success("Member removed");
        setMembers(members.filter((m) => m.id !== id));
      } else {
        await authClient.organization.cancelInvitation(
          {
            invitationId: id,
          },
          {
            headers: {
              "x-org-id": session.session.activeOrganizationId,
            },
          }
        );
        toast.success("Invitation canceled");
        setInvites(invites.filter((i) => i.id !== id));
      }
    } catch (error) {
      toast.error(
        type === "member"
          ? "Failed to remove member"
          : "Failed to cancel invitation"
      );
    }
  };

  const allItems = [
    ...invites.map((invite) => ({
      id: invite.id,
      type: "invite" as const,
      user: {
        name: "Pending Invite",
        email: invite.email,
      },
      role: invite.role,
      status: "Pending",
    })),
    ...members.map((member) => ({
      ...member,
      type: "member" as const,
      status: "Active",
    })),
  ];

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
          <div className="text-center py-8 text-muted-foreground">
            Loading members...
          </div>
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
              {allItems.map((member, idx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{
                    y: -2,
                    boxShadow:
                      "0 25px 50px -12px rgba(var(--primary-rgb), 0.08)",
                  }}
                  className="group grid grid-cols-5 items-center gap-4 rounded-xl border border-border/60 bg-card px-6 py-5 transition-all duration-300"
                  style={{ minHeight: "80px" }}
                >
                  <div className="col-span-2 flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20">
                      <span className="text-sm font-medium text-primary">
                        {member.user?.name?.charAt(0) ||
                          member.user?.email?.charAt(0) ||
                          "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {member.user?.name || "Unknown"}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {member.user?.email}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
                        member.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-primary/20 text-primary"
                      )}
                    >
                      {member.status}
                    </span>
                  </div>
                  <div>
                    <Select
                      defaultValue={member.role}
                      disabled={member.type === "invite"}
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
                      onClick={() => handleRemove(member.id, member.type)}
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
