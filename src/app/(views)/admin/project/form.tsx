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
import { getById, POST, PUT } from "@/utils/project";
import { ProjectType } from "./types";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FormInputProps {
  dialogOpen: boolean;
  dialogClose: () => void;
  addProject: (project: ProjectType, isUpdate?: boolean) => void;
  editId: string;
}

const FormInput: React.FC<FormInputProps> = ({
  dialogOpen,
  dialogClose,
  addProject,
  editId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [oldImage, setOldImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | string>("");

  const [formData, setFormData] = useState<ProjectType>({
    id: "",
    name: "",
    description: "",
    image: "",
    tech_stack: [],
    project_url: "",
    repository_url: "",
  });

  useEffect(() => {
    if (editId) {
      const fetchProject = async () => {
        setIsLoading(true);
        try {
          const response = await getById(editId);
          if (response && response.data) {
            setFormData(response.data);
            setOldImage(response.data.image);
          }
        } catch (error) {
          console.error("Error fetching project:", error);
        } finally {
          setIsLoading(false);
        }
      };
      setImageFile("");

      fetchProject();
    } else if (dialogOpen) {
      setImageFile("");

      setFormData({
        id: "",
        name: "",
        description: "",
        image: "",
        tech_stack: [],
        project_url: "",
        repository_url: "",
      });
    }
  }, [editId, dialogOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | Option[]) => {
    if (Array.isArray(e)) {
      // Mengatur array string dari nilai MultipleSelector
      setFormData((prevData) => ({
        ...prevData,
        tech_stack: e.map((option) => option.value), // Ubah menjadi array string
      }));
    } else {
      const { name, value, files } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: files && files.length > 0 ? files[0] : value,
      }));

      if (name === "image" && files?.length) {
        setImageFile(files[0]);
      }
    }
  };

  const formAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editId) {
        const response = await PUT({
          id: editId,
          name: formData.name,
          description: formData.description,
          image: imageFile || "",
          tech_stack: JSON.stringify(formData.tech_stack),
          project_url: formData.project_url,
          repository_url: formData.repository_url,
          old_image: formData.image !== oldImage ? (oldImage as string) : "",
        });

        addProject(response.data, true);
      } else {
        if (formData.name.trim()) {
          const response = await POST({
            id: "",
            name: formData.name,
            description: formData.description,
            image: formData.image,
            tech_stack: JSON.stringify(formData.tech_stack),
            project_url: formData.project_url,
            repository_url: formData.repository_url,
            old_image: "",
          });

          addProject(response.data);
        }
      }

      setImageFile("");
      dialogClose();
    } catch (error) {
      console.error("Error processing project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const OPTIONS: Option[] = [
    { label: "nextjs", value: "Nextjs" },
    { label: "Vite", value: "vite" },
    { label: "Nuxt", value: "nuxt" },
    { label: "Vue", value: "vue, " },
    { label: "Remix", value: "remix" },
    { label: "Svelte", value: "svelte" },
    { label: "Angular", value: "angular" },
    { label: "Ember", value: "ember" },
    { label: "React", value: "react" },
    { label: "Gatsby", value: "gatsby" },
    { label: "Astro", value: "astro" },
  ];

  return (
    <Dialog open={dialogOpen} onOpenChange={dialogClose}>
      <DialogContent className="p-0">
        <ScrollArea className="h-[96vh] w-full ">
          <form onSubmit={formAction} className="space-y-4 px-6 py-4">
            <DialogHeader>
              <DialogTitle>
                {editId ? "Edit Project" : "Add New Project"}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Project Name"
                  type="text"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Project Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Project Description"
                  type="text"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Project Image</Label>
                <Input
                  id="image"
                  name="image"
                  onChange={handleChange}
                  placeholder="Project image"
                  type="file"
                  className="w-full"
                  required={editId ? false : true}
                />

                {imageFile ? (
                  <Image
                    src={URL.createObjectURL(imageFile as File)}
                    alt="project"
                    width={100}
                    height={100}
                  />
                ) : formData.image ? (
                  <Image
                    src={`/file/${formData.image}`}
                    alt="project"
                    width={100}
                    height={100}
                  />
                ) : (
                  <></>
                )}
              </div>

              <div className="w-full">
                <Label htmlFor="name">Tech Stack</Label>
                <MultipleSelector
                  defaultOptions={OPTIONS}
                  value={formData.tech_stack.map((value: string) => ({
                    label:
                      OPTIONS.find((opt) => opt.value === value)?.label ||
                      value,
                    value,
                  }))}
                  onChange={(selectedOptions) => handleChange(selectedOptions)}
                  placeholder={"Tech Stacry"}
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      no results found.
                    </p>
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Project Project URL</Label>
                <Input
                  id="project_url"
                  name="project_url"
                  value={formData.project_url}
                  onChange={handleChange}
                  placeholder="Project Project URL"
                  type="url"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Project Repository URL</Label>
                <Input
                  id="repository_url"
                  name="repository_url"
                  value={formData.repository_url}
                  onChange={handleChange}
                  placeholder="Project Repository URL"
                  type="url"
                  className="w-full"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Processing..."
                  : editId
                  ? "Update Project"
                  : "Add Project"}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FormInput;
