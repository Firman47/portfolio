"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { CategoryType } from "./types";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

interface ColumnProps {
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setEditId: React.Dispatch<React.SetStateAction<string>>;
  setDeleteId: React.Dispatch<React.SetStateAction<string[]>>;
  setDeleteIdAction: React.Dispatch<React.SetStateAction<string[]>>;
  setDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export const columns: (
  setDialog: ColumnProps["setDialog"],
  setEditId: ColumnProps["setEditId"],
  setDeleteId: ColumnProps["setDeleteId"],
  setDeleteIdAction: ColumnProps["setDeleteIdAction"],
  setDeleteDialog: ColumnProps["setDeleteDialog"]
) => ColumnDef<CategoryType>[] = (
  setDialog,
  setEditId,
  setDeleteId,
  setDeleteIdAction,
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
              setDeleteIdAction((prevIds) => {
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
];
