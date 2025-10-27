"use client";

import {
  DataTablePagination,
  DataTableSearch,
  DefaultTableBody,
  DefaultTableHeader,
} from "@/components/data-table";
import { Table } from "@/ui/table";

import { useDataTable } from "@/hooks/client";

import { columns } from "./column";
import { mockCampaigns } from "@/data/campaign";

export const CampaignTable = () => {
  const { id, table, inputRef } = useDataTable({
    data: mockCampaigns,
    columns,
    pageSize: 10,
  });

  return (
    <div className="mx-auto mt-2 max-w-max space-y-4 overflow-hidden p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <DataTableSearch
            id={id}
            placeholder="Filter file name"
            table={table}
            inputRef={inputRef}
            filterColumn="name"
          />
        </div>
      </div>

      <div className="bg-background overflow-hidden rounded-md border">
        <Table className="table-fixed rounded-xl">
          <DefaultTableHeader table={table} />
          <DefaultTableBody table={table} columns={columns} />
        </Table>
      </div>

      <DataTablePagination id={id} table={table} />
    </div>
  );
};
