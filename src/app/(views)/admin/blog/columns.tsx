"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { BlogType } from "./types";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CategoryType } from "../category/types";
import { Badge } from "@/components/ui/badge";

interface ColumnProps {
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setEditId: React.Dispatch<React.SetStateAction<string>>;
  deleteId: string[];
  setDeleteId: React.Dispatch<React.SetStateAction<string[]>>;
  setDeleteIdAction: React.Dispatch<React.SetStateAction<string[]>>;
  setDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  dataCategory: CategoryType[];
}

export const columns: (
  setDialog: ColumnProps["setDialog"],
  setEditId: ColumnProps["setEditId"],
  deleteId: ColumnProps["deleteId"],
  setDeleteId: ColumnProps["setDeleteId"],
  setDeleteIdAction: ColumnProps["setDeleteIdAction"],
  setDeleteDialog: ColumnProps["setDeleteDialog"],
  dataCategory: ColumnProps["dataCategory"]
) => ColumnDef<BlogType>[] = (
  setDialog,
  setEditId,
  deleteId,
  setDeleteId,
  setDeleteIdAction,
  setDeleteDialog,
  dataCategory
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
          key={rowData.id}
          checked={deleteId.includes(rowData.id)}
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Title"
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
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
        className="flex justify-center"
      />
    ),
    cell: ({ row }) => {
      // type statusBlog = "draft" | "published" | "deleted";

      const rowData = row.original;
      return (
        <Badge
          className="capitalize"
          variant={
            rowData.status == "draft"
              ? "secondary"
              : rowData.status == "published"
              ? "default"
              : "destructive"
          }
        >
          {rowData.status}
        </Badge>
      );
    },
  },

  // {
  //   accessorKey: "content",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title="Content"
  //       className="flex justify-center"
  //     />
  //   ),
  // },

  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Category"
        className="flex justify-center"
      />
    ),
    cell: ({ row }) => {
      const rowData = row.original;

      const categories = rowData.category_id.map((id: string) => {
        return dataCategory.find((item: CategoryType) => item.id === id);
      });

      const categoryNames = categories
        .filter((category): category is CategoryType => category !== undefined)
        .map((category) => category.name);

      return (
        <span>
          {categoryNames.length > 0 ? categoryNames.join(", ") : "Unknown"}
        </span>
      );
    },
  },
];
