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

  const getEmail = (member: any): string => {
    const candidates = [
      member?.email,
      member?.user?.email,
      member?.userEmail,
      member?.user_email,
      member?.profile?.email,
      member?.user?.primaryEmail,
      member?.user?.emailAddress,
      member?.user?.email_address,
      member?.user?.emails?.[0],
      member?.user?.emails?.[0]?.email,
      member?.user?.emailAddresses?.[0]?.emailAddress,
    ];

    const first = candidates
      .map((v) => (typeof v === "string" ? v.trim() : ""))
      .find((v) => v.length > 0);

    if (first) return first;

    const memberUserId =
      member?.userId ?? member?.user?.id ?? member?.memberId ?? member?.id;
    const sessionUserId = session?.user?.id;
    const sessionEmail = session?.user?.email;
    if (sessionEmail && sessionUserId && memberUserId === sessionUserId) {
      return String(sessionEmail);
    }

    return "Unknown";
  };

  useEffect(() => {
    const fetchMembersAndInvites = async () => {
      if (session?.session?.activeOrganizationId) {
        setLoading(true);
        try {
          const orgId = session.session.activeOrganizationId;

          const [membersRes, invitesRes] = await Promise.all([
            fetch(`/api/v1/organizations/${orgId}/members?limit=100`, {
              headers: { "x-org-id": orgId },
            }),
            fetch(`/api/v1/organizations/${orgId}/invites`, {
              headers: { "x-org-id": orgId },
            }),
          ]);

          const membersData = await membersRes.json();
          // Handle invites silently if they fail (e.g. 403)
          let invitesData = { data: [] };
          if (invitesRes.ok) {
            invitesData = await invitesRes.json();
          }

          // Handle members response
          // Backend might return { items: [], meta: ... } or just [] or { data: [] }
          const membersRaw = membersData;
          let membersList: any[] = [];

          if (Array.isArray(membersRaw)) {
            membersList = membersRaw;
          } else if (
            (membersRaw as any)?.members &&
            Array.isArray((membersRaw as any).members)
          ) {
            membersList = (membersRaw as any).members;
          } else if (
            (membersRaw as any)?.data?.members &&
            Array.isArray((membersRaw as any).data.members)
          ) {
            membersList = (membersRaw as any).data.members;
          } else if (
            (membersRaw as any)?.data &&
            Array.isArray((membersRaw as any).data)
          ) {
            membersList = (membersRaw as any).data;
          }
          setMembers(membersList);

          // Handle invites response
          if (invitesData) {
            const invitesRaw = invitesData;
            let invitesList: any[] = [];

            if (Array.isArray(invitesRaw)) {
              invitesList = invitesRaw;
            } else if (
              (invitesRaw as any)?.invitations &&
              Array.isArray((invitesRaw as any).invitations)
            ) {
              invitesList = (invitesRaw as any).invitations;
            } else if (
              (invitesRaw as any)?.data?.invitations &&
              Array.isArray((invitesRaw as any).data.invitations)
            ) {
              invitesList = (invitesRaw as any).data.invitations;
            } else if (
              (invitesRaw as any)?.data &&
              Array.isArray((invitesRaw as any).data)
            ) {
              invitesList = (invitesRaw as any).data;
            }
            setInvites(invitesList);
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
      const orgId = session.session.activeOrganizationId;
      const response = await fetch(
        `/api/v1/organizations/${orgId}/members/${memberId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-org-id": orgId,
          },
          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      if (response.ok) {
        toast.success("Role updated");
        // Update local state to reflect change
        setMembers((prev) =>
          prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
        );
      } else {
        throw new Error("Failed to update role");
      }
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleRemove = async (id: string, type: "member" | "invite") => {
    if (!session?.session?.activeOrganizationId) return;
    const orgId = session.session.activeOrganizationId;

    try {
      if (type === "member") {
        const response = await fetch(
          `/api/v1/organizations/${orgId}/members/${id}`,
          {
            method: "DELETE",
            headers: {
              "x-org-id": orgId,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to remove member");

        toast.success("Member removed");
        setMembers(members.filter((m) => m.id !== id));
      } else {
        // Assuming DELETE /organizations/{orgId}/invites/{id} for canceling invites
        const response = await fetch(
          `/api/v1/organizations/${orgId}/invites/${id}`,
          {
            method: "DELETE",
            headers: {
              "x-org-id": orgId,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to cancel invitation");

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

  const getInitial = (item: { name?: string; email?: string }) => {
    const nameInitial = item.name?.charAt(0);
    if (nameInitial && nameInitial.length > 0) return nameInitial;
    const emailInitial = item.email?.charAt(0);
    if (emailInitial && emailInitial.length > 0) return emailInitial;
    return "U";
  };

  const allItems = [
    ...invites.map((invite) => ({
      id: invite.id,
      type: "invite" as const,
      name: "Pending Invite",
      email: invite.email,
      role: invite.role,
      status: "Pending",
    })),
    ...members.map((member) => ({
      id: member.id,
      type: "member" as const,
      name:
        typeof member.name === "string" && member.name.trim().length > 0
          ? member.name
          : typeof member.user?.name === "string" &&
              member.user.name.trim().length > 0
            ? member.user.name
            : "Unknown",
      email: getEmail(member),
      role: member.role,
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
                        {getInitial(member)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {member.name}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {member.email}
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
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="EDITOR">Editor</SelectItem>
                        <SelectItem value="VIEWER">Viewer</SelectItem>
                        <SelectItem value="OWNER">Owner</SelectItem>
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

            {/* Mobile list */}
            <div className="space-y-4 lg:hidden">
              {allItems.map((member, idx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-xl border border-border/60 bg-card p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                        <span className="text-xs font-medium text-primary">
                          {getInitial(member)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      onClick={() => handleRemove(member.id, member.type)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium",
                        member.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-primary/20 text-primary"
                      )}
                    >
                      {member.status}
                    </span>
                    <Select
                      defaultValue={member.role}
                      disabled={member.type === "invite"}
                      onValueChange={(val) => handleRoleChange(member.id, val)}
                    >
                      <SelectTrigger className="h-8 w-24 border-border/80 bg-background/50 text-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="EDITOR">Editor</SelectItem>
                        <SelectItem value="VIEWER">Viewer</SelectItem>
                        <SelectItem value="OWNER">Owner</SelectItem>
                      </SelectContent>
                    </Select>
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
