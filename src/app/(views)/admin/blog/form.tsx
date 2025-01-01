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
import { getById, POST, PUT } from "@/utils/blog";
import { BlogType } from "./types";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { get } from "@/utils/category";
import { CategoryType } from "../category/types";
import Editor from "@/components/editor";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FormInputProps {
  dialogOpen: boolean;
  dialogClose: () => void;
  addBlog: (blog: BlogType, isUpdate?: boolean) => void;
  editId: string;
}

const FormInput: React.FC<FormInputProps> = ({
  dialogOpen,
  dialogClose,
  addBlog,
  editId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState<Option[]>([]);
  type typeStatusBlog = "draft" | "published" | "deleted";

  const [statusBlog, setStatusBlog] = useState<typeStatusBlog>("draft");

  const [formData, setFormData] = useState<BlogType>({
    id: "",
    title: "",
    content: "",
    status: "draft",
    category_id: [],
  });

  useEffect(() => {
    if (editId) {
      const fetchBlog = async () => {
        setIsLoading(true);
        try {
          const response = await getById(editId);
          if (response && response.data) {
            setFormData(response.data);
            setStatusBlog(response.data.status as typeStatusBlog);
          }
        } catch (error) {
          console.error("Error fetching blog:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchBlog();
    } else if (dialogOpen) {
      setFormData({
        id: "",
        title: "",
        content: "",
        status: "draft",
        category_id: [],
      });
    }
  }, [editId, dialogOpen]);

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const response = await get();
        if (response && response.data) {
          const result = response.data.map((item: CategoryType) => ({
            label: item.name,
            value: item.id,
          }));

          setCategory(result);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | Option[]) => {
    if (Array.isArray(e)) {
      // Mengatur array string dari nilai MultipleSelector
      setFormData((prevData) => ({
        ...prevData,
        category_id: e.map((option) => option.value), // Ubah menjadi array string
      }));
    } else {
      const { name, value, files } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: files && files.length > 0 ? files[0] : value,
      }));
    }
  };

  const formAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const blogData = {
        id: editId || "",
        title: formData.title,
        content: formData.content,
        status: statusBlog, // Gunakan statusBlog untuk memastikan status diatur dari user input
        category_id: formData.category_id,
      };

      if (editId) {
        const response = await PUT(blogData);

        addBlog(response.data, true);
      } else {
        const response = await POST(blogData);

        addBlog(response.data);
      }

      dialogClose();
    } catch (error) {
      console.error("Error processing blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={dialogClose}>
      <DialogContent className="p-0">
        <ScrollArea className=" max-h-[96vh] w-full ">
          <form onSubmit={formAction} className="space-y-4 px-6 py-4">
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Blog" : "Add New Blog"}</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Blog Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Blog Title"
                  type="text"
                  required
                />
              </div>

              <Editor
                id="content"
                name="content"
                value={formData.content}
                onChange={
                  (updatedContent) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: updatedContent,
                    })) // Perbarui content di state
                }
              />

              <div className="w-full">
                <Label htmlFor="name">Category</Label>
                <MultipleSelector
                  defaultOptions={category}
                  value={
                    category.length > 0
                      ? formData.category_id.map((value: string) => ({
                          label:
                            category.find((opt) => opt.value === value)
                              ?.label || value,
                          value,
                        }))
                      : []
                  }
                  onChange={(selectedOptions) => handleChange(selectedOptions)}
                  placeholder={"Category"}
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      no results found.
                    </p>
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                variant={"secondary"}
                onClick={() => setStatusBlog("draft")}
              >
                {isLoading ? "Processing..." : editId ? "Draft" : "Draft"}
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                onClick={() => setStatusBlog("published")}
              >
                {isLoading ? "Processing..." : editId ? "Publish" : "Publish"}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FormInput;
