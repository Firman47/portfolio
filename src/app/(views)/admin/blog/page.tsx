"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { DELETE, get } from "@/utils/blog";
import { get as getCategory } from "@/utils/category";
import { BlogType } from "./types";
import FormInput from "./form";
import Loading from "@/components/ui/loading";
import { Table } from "@tanstack/react-table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CategoryType } from "../category/types";

export default function Page() {
  const [data, setData] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [dialog, setDialog] = useState(false);
  const [editId, setEditId] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string[]>([]);
  const [deleteIdAction, setDeleteIdAction] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [dataCategory, setDataCategory] = useState<CategoryType[]>([]);
  const [tableInstance, setTableInstance] = useState<Table<BlogType> | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await get();
        const result = response.data.map((item: BlogType, index: number) => ({
          no: index + 1,
          ...item,
        }));
        setData(result);

        const responseCategory = await getCategory();
        setDataCategory(responseCategory.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const dialogClose = () => {
    setDialog(false);
    setEditId("");
  };

  const addBlog = (blog: BlogType, isUpdate = false) => {
    setData((prevCategories) =>
      isUpdate
        ? prevCategories.map((existingBlog) =>
            existingBlog.id === blog.id
              ? {
                  ...blog,
                  no: prevCategories.findIndex((cat) => cat.id === blog.id) + 1,
                }
              : existingBlog
          )
        : [...prevCategories, { ...blog, no: prevCategories.length + 1 }]
    );
  };

  const resetSelection = (table: Table<BlogType>) => {
    table.getRowModel().rows.forEach((row) => {
      row.toggleSelected(false); // Uncheck semua checkbox
    });
  };

  const deleteHandler = async () => {
    if (!tableInstance) return;

    try {
      setLoadingDelete(true);

      const id = deleteId.length > 0 ? deleteId : deleteIdAction;
      await DELETE(id);

      setData((prevData) => {
        const updatedData = prevData.filter((item) => !id.includes(item.id));
        return updatedData.map((item, index) => ({
          ...item,
          no: index + 1,
        }));
      });

      setDeleteId([]);
      setDeleteIdAction([]);
      resetSelection(tableInstance);
    } catch (error) {
      console.error("Error deleting data:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="container mx-auto py-4">
      <DataTable
        title="Table Blog"
        columns={columns(
          setDialog,
          setEditId,
          deleteId,
          setDeleteId,
          setDeleteIdAction,
          setDeleteDialog,
          dataCategory
        )}
        data={data}
        isLoading={loading}
        dialog={() => setDialog(true)}
        setTableInstance={(table: Table<BlogType>) => setTableInstance(table)}
        deleteDialog={() => setDeleteDialog(deleteId.length > 0 ? true : false)}
      />

      <FormInput
        dialogOpen={dialog}
        dialogClose={() => dialogClose()}
        addBlog={addBlog}
        editId={editId}
      />

      <AlertDialog
        open={deleteDialog}
        onOpenChange={() => {
          setDeleteDialog(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog and remove all related data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialog(false);
                setDeleteIdAction([]);
              }}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => deleteHandler()}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {loadingDelete ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Loading open={loadingDelete} />
    </div>
  );
}
