import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

interface DnsRecordProps {
  record: {
    type: string;
    host: string;
    value: string;
    status?: string;
    description?: string;
    priority?: number;
  };
}

const copy = (text: string) => navigator.clipboard.writeText(text);
const DnsRecord: React.FC<DnsRecordProps> = ({ record }) => {
  const handleCopy = (text: string, field: string) => {
    copy(text);
    toast.success(`${field} copied to clipboard`);
  };

  return (
    <div className="rounded-lg border border-border bg-background p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold uppercase text-foreground">
            {record.type} Record
          </span>
          {record.status && (
            <span
              className={cn(
                "text-[10px] px-1.5 rounded uppercase font-bold",
                record.status === "Required"
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-600"
              )}
            >
              {record.status}
            </span>
          )}
        </div>
      </div>

      {record.description && (
        <p className="text-xs text-muted-foreground italic">
          {record.description}
        </p>
      )}

      <div className="space-y-2 text-sm">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <span className="w-[60px] text-muted-foreground font-medium">
            Host
          </span>
          <div className="flex-1 flex items-center justify-between bg-muted/50 p-1.5 rounded-md">
            <code className="text-xs break-all px-1">{record.host}</code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleCopy(record.host, "Host")}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <span className="w-[60px] text-muted-foreground font-medium">
            Value
          </span>
          <div className="flex-1 flex items-center justify-between bg-muted/50 p-1.5 rounded-md">
            <code className="text-xs break-all px-1">
              {record.priority !== undefined && `[${record.priority}] `}
              {record.value}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleCopy(record.value, "Value")}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DnsRecord;
