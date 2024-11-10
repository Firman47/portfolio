"use client";

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
import { useEffect, useState } from "react";
import { Projects } from "./types";

async function deleteData(url = "", data = {}) {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error editing data:", error);
    throw error;
  }
}

interface DialogProps {
  isOpen: boolean;
  project?: Projects;
  onDelete: (project: Projects) => void;
  onClose: () => void;
}

const DeleteProjectDialog: React.FC<DialogProps> = ({
  isOpen,
  project,
  onDelete,
  onClose,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSubmit = async () => {
    if (!project) return;

    try {
      await deleteData(`http://localhost:3000/api/project`, {
        id: project.id,
      });
      onDelete(project); // Hanya panggil onDelete sekali di sini
      onClose(); // Pastikan dialog ditutup setelah penghapusan
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  useEffect(() => {
    setIsDeleteDialogOpen(isOpen);
  }, [isOpen]);

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProjectDialog;
