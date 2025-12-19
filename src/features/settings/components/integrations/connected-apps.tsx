
import React from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { fadeInUp, staggerContainer, integrationsList } from "../../utils";

const ConnectedApps = () => {
  return (
    <motion.section variants={staggerContainer} initial="initial" animate="animate">
      <motion.h2
        variants={fadeInUp}
        className="text-xl font-light tracking-tight text-foreground lg:text-2xl"
      >
        Connected apps
      </motion.h2>
      <motion.p variants={fadeInUp} className="mt-3 text-muted-foreground">
        Manage third-party integrations
      </motion.p>

      <motion.div
        variants={fadeInUp}
        className="mt-8 border-t border-border/60 pt-8 lg:mt-10 lg:pt-10"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {integrationsList.map((app, idx) => (
            <motion.div
              key={app.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-xl font-bold text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  {app.name[0]}
                </div>
                <h3 className="mt-4 font-medium text-foreground">{app.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{app.desc}</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span
                  className={`text-xs font-medium ${
                    app.connected ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {app.connected ? "Connected" : "Not connected"}
                </span>
                <Switch checked={app.connected} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default ConnectedApps;
