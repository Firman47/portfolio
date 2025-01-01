"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { DELETE, get } from "@/utils/blog";
import { BlogType } from "./types";
import FormInput from "./form";
import Loading from "@/components/ui/loading";

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

export default function Page() {
  const [data, setData] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [dialog, setDialog] = useState(false);
  const [editId, setEditId] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);

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
    setEditId(""); // Reset editId saat dialog ditutup
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

  const deleteHandler = async (id: string[]) => {
    try {
      setLoadingDelete(true);
      await DELETE(id);
      setData((prevData) => prevData.filter((item) => !id.includes(item.id)));
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
        columns={columns(setDialog, setEditId, setDeleteId, setDeleteDialog)}
        data={data}
        isLoading={loading}
        dialog={() => setDialog(true)}
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
              }}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => deleteHandler(deleteId)}
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
