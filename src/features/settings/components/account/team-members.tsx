
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, ShieldCheck, AlertCircle, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fadeInUp, staggerContainer, teamMembers } from "../../utils";

interface TeamMembersProps {
  setShowInviteUserModal: (show: boolean) => void;
}

const TeamMembers = ({ setShowInviteUserModal }: TeamMembersProps) => {
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
        {/* Desktop table */}
        <div className="hidden space-y-3 lg:block">
          <div className="grid grid-cols-5 gap-4 px-6 py-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-2">User</div>
            <div>2FA</div>
            <div>Role</div>
            <div className="text-right">Actions</div>
          </div>
          {teamMembers.map((member, idx) => (
            <motion.div
              key={member.email}
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
                    {member.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{member.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>
              </div>
              <div>
                {member.twoFA ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1.5 text-xs font-medium text-primary">
                    <ShieldCheck className="h-3 w-3" />
                    Enabled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    Disabled
                  </span>
                )}
              </div>
              <div>
                <Select defaultValue={member.role.toLowerCase()}>
                  <SelectTrigger className="h-10 w-32 border-border/80 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-right">
                {member.role !== "Owner" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default TeamMembers;
