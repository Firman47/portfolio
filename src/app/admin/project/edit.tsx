"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Projects } from "./types";
// Fungsi untuk mengedit data
async function editData(url = "", data = {}) {
  try {
    const response = await fetch(url, {
      method: "PUT",
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
  onClose: () => void;
  project?: Projects; // Optional jika project mungkin kosong saat tambah baru
  onUpdate: (project: Projects) => void;
}

const EditProjectDialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  project,
  onUpdate,
}) => {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");

  useEffect(() => {
    setName(project?.name || "");
    setDescription(project?.description || "");
  }, [project]);

  const handleSubmit = async () => {
    try {
      const updatedProject = await editData(
        `http://localhost:3000/api/project`,
        { id: project?.id, name, description }
      );
      onUpdate(updatedProject.data);
      onClose();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project Name"
          />
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project Description"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Update Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
