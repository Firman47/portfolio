"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { ProjectType } from "./types";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Image from "next/image";

interface ColumnProps {
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setEditId: React.Dispatch<React.SetStateAction<string>>;
  setDeleteId: React.Dispatch<React.SetStateAction<string[]>>;
  setDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export const columns: (
  setDialog: ColumnProps["setDialog"],
  setEditId: ColumnProps["setEditId"],
  setDeleteId: ColumnProps["setDeleteId"],
  setDeleteDialog: ColumnProps["setDeleteDialog"]
) => ColumnDef<ProjectType>[] = (
  setDialog,
  setEditId,
  setDeleteId,
  setDeleteDialog
) => [
  {
    id: "select",
    header: ({ table }) => {
      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            const allRowIds = table
              .getRowModel()
              .rows.map((row) => row.original.id);
            setDeleteId(value ? allRowIds : []);
          }}
          aria-label="Select all"
        />
      );
    },
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);

            setDeleteId((prevIds) => {
              if (value) {
                return [...prevIds, rowData.id];
              } else {
                return prevIds.filter((id) => id !== rowData.id);
              }
            });
          }}
          aria-label="Select row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "no",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="No"
        className="flex justify-center"
      />
    ),
  },

  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <div className="space-x-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setDialog(true);
              setEditId(rowData.id);
            }}
          >
            <FaEdit />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setDeleteId((prevIds) => {
                if (!prevIds.includes(rowData.id)) {
                  return [...prevIds, rowData.id];
                }
                return prevIds;
              });
              setDeleteDialog(true);
            }}
          >
            <MdDelete />
          </Button>
        </div>
      );
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Name"
        className="flex justify-center"
      />
    ),
  },

  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Description"
        className="flex justify-center"
      />
    ),
  },

  {
    accessorKey: "image",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Image"
        className="flex justify-center"
      />
    ),
    cell: ({ row }) => (
      <Image
        src={`/file/${row.original.image}`}
        alt=""
        width={500}
        height={300}
      />
    ),
  },

  {
    accessorKey: "tech_stack",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Tech Stack"
        className="flex justify-center"
      />
    ),
  },

  {
    accessorKey: "project_url",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Project URL"
        className="flex justify-center"
      />
    ),
  },

  {
    accessorKey: "repository_url",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Repository URL"
        className="flex justify-center"
      />
    ),
  },
];
