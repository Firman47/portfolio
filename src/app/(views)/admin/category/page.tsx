"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { DELETE, get } from "@/utils/category";
import { CategoryType } from "./types";
import FormInput from "./form";
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
  const [data, setData] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [editId, setEditId] = useState<string>("");
  const [deleteId, seDeleteId] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const dialogClose = () => {
    setDialog(false);
    setEditId(""); // Reset editId saat dialog ditutup
  };

  const addCategory = (category: CategoryType, isUpdate = false) => {
    if (isUpdate) {
      setData((prevCategories) =>
        prevCategories.map((existingCategory) =>
          existingCategory.id === category.id ? category : existingCategory
        )
      );
    } else {
      setData((prevCategories) => [...prevCategories, category]);
    }
  };

  const deleteHandler = async (id: string[]) => {
    try {
      console.log("cek id delete ", deleteId);

      setLoadingDelete(true);
      await DELETE(id);
      setData((prevData) => prevData.filter((item) => !id.includes(item.id)));
    } catch (error) {
      console.error("Error deleting data:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await get();
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="container mx-auto py-4">
      <DataTable
        title="Table Project"
        columns={columns(setDialog, setEditId, seDeleteId, setDeleteDialog)}
        data={data}
        isLoading={loading}
        dialog={() => setDialog(true)}
        deleteDialog={() => setDeleteDialog(deleteId.length > 0 ? true : false)}
      />

      <FormInput
        dialogOpen={dialog}
        dialogClose={() => dialogClose()}
        addCategory={addCategory}
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
              project and remove all related data from our servers.
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
    </div>
  );
}
