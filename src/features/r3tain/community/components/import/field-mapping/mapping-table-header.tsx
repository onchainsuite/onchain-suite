"use client";

export function MappingTableHeader() {
  return (
    <thead className="bg-muted/50 border-border border-b">
      <tr>
        <th className="text-foreground p-4 text-left font-medium">Import</th>
        <th className="text-foreground p-4 text-left font-medium">
          File Column Name
        </th>
        <th className="text-foreground p-4 text-center font-medium">
          Match To
        </th>
        <th className="text-foreground p-4 text-left font-medium">
          R3tain Field Names
        </th>
        <th className="text-foreground p-4 text-left font-medium">
          Preview Data
        </th>
        <th className="text-foreground p-4 text-left font-medium">Data Type</th>
      </tr>
    </thead>
  );
}
