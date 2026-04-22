import { motion } from "framer-motion";
import { Layout, Plus } from "lucide-react";

import { type Template } from "@/features/automation/types";

interface TemplatesListProps {
  templates: Template[];
}

export const TemplatesList = ({ templates }: TemplatesListProps) => {
  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
          <Layout className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          No templates yet
        </h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Templates will appear here as you create and save automation patterns.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-secondary p-2">
              <Layout className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {template.category}
            </div>
          </div>
          <h3 className="font-semibold text-foreground">{template.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {template.description}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>{template.uses.toLocaleString()} uses</span>
            <button className="flex items-center gap-1 font-medium text-primary hover:text-primary/90">
              <Plus className="h-3 w-3" />
              Use template
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
