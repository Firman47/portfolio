"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getById, POST, PUT } from "@/utils/category";
import { CategoryType } from "./types";

interface FormInputProps {
  dialogOpen: boolean;
  dialogClose: () => void;
  addCategory: (category: CategoryType, isUpdate?: boolean) => void;
  editId: string;
}

const FormInput: React.FC<FormInputProps> = ({
  dialogOpen,
  dialogClose,
  addCategory,
  editId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CategoryType>({ id: "", name: "" });

  useEffect(() => {
    if (editId) {
      const fetchCategory = async () => {
        setIsLoading(true);
        try {
          const response = await getById(editId);
          if (response && response.data) {
            setFormData(response.data);
          }
        } catch (error) {
          console.error("Error fetching category:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCategory();
    } else if (dialogOpen) {
      setFormData({ id: "", name: "" });
    }
  }, [editId, dialogOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editId) {
        const response = await PUT({
          id: editId,
          name: formData.name,
        });

        addCategory(response.data, true);
      } else {
        if (formData.name.trim()) {
          const response = await POST({ name: formData.name });

          addCategory(response.data);
        }
      }

      dialogClose();
    } catch (error) {
      console.error("Error processing category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={dialogClose}>
      <DialogContent>
        <form onSubmit={formAction} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Category Name"
              type="text"
              className="w-full"
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Processing..."
                : editId
                ? "Update Category"
                : "Add Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormInput;
