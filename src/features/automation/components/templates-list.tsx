import { motion } from "framer-motion";
import { Copy, Plus, Layout } from "lucide-react";
import { Template } from "@/features/automation/types";

interface TemplatesListProps {
  templates: Template[];
}

export const TemplatesList = ({ templates }: TemplatesListProps) => {
  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border border-dashed py-16 text-center">
        <div className="mb-4 rounded-full bg-secondary p-4">
          <Layout className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground">
          No templates available
        </h3>
        <p className="mt-1 text-muted-foreground">
          Check back later for new automation templates
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
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
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
            <button className="flex items-center gap-1 font-medium text-emerald-600 hover:text-emerald-700">
              <Plus className="h-3 w-3" />
              Use template
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
