"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/data-table/pagination";
import { DataTableViewOptions } from "@/components/data-table/view-options";
import { HiOutlinePlus } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  title: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  dialog: () => void;
}
export function DataTable<TData, TValue>({
  title,
  columns,
  data,
  isLoading,
  dialog,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <>
      <div className="border rounded-md container max-w-[975px] mx-auto">
        <div className="border-b p-3 text-center rounded-md rounded-b-none w-full bg-sidebar">
          {title}
        </div>

        <div className=" w-full flex justify-between p-3 items-center">
          <Input
            placeholder="Filter"
            onChange={(event) => {
              const value = event.target.value;
              table.setGlobalFilter(value);
              setGlobalFilter(value);
            }}
            value={globalFilter}
            className="max-w-sm"
          />

          <div className="flex gap-2">
            <Button variant="outline" onClick={dialog}>
              <HiOutlinePlus />
              Add
            </Button>
            <Button variant="outline">
              <MdDelete />
              Delete
            </Button>

            <DataTableViewOptions table={table} />
          </div>
        </div>

        <ScrollArea className="whitespace-nowrap w-full">
          <Table className="border ">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="py-4  ">
                    <div className="mx-auto border-2 h-8 w-8 animate-spin rounded-full border-t-primary" />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <DataTablePagination table={table} />
      </div>
    </>
  );
}
