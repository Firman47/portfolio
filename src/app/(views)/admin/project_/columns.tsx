"use client";

// import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Projects } from "./types";

export const columns: ColumnDef<Projects>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },

  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: "image_url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
  },
  {
    accessorKey: "tech_stack",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tech stack" />
    ),
  },
  {
    accessorKey: "project_url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project URL" />
    ),
  },
  {
    accessorKey: "repository_url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Repository URL" />
    ),
  },

  {
    id: "actions",
    header: "Action",
    cell: () => {
      return <></>;
    },
  },
];
