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
  const [projects, setProjects] = useState({
    name: "",
    description: "",
    imageUrl: "",
    techStack: "",
    projectUrl: "",
    repositoryUrl: "",
  });

  // Fungsi untuk meng-update field tertentu di project
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProjects((prevProject) => ({
      ...prevProject,
      [id]: value,
    }));
  };

  // const [name, setName] = useState(project?.name || "");
  // const [description, setDescription] = useState(project?.description || "");

  useEffect(() => {
    if (project) {
      setProjects({
        name: project.name || "",
        description: project.description || "",
        imageUrl: project.image_url || "",
        techStack: Array.isArray(project.tech_stack)
          ? project.tech_stack.join(", ")
          : project.tech_stack || "",
        projectUrl: project.project_url || "",
        repositoryUrl: project.repository_url || "",
      });
    }
  }, [project]);

  const handleSubmit = async () => {
    try {
      const techStackArray = projects.techStack
        .split(/[\n,]+/) // Split berdasarkan koma atau newline
        .map((tech) => tech.trim()) // Hapus spasi kosong di setiap item
        .filter((tech) => tech); // Buang item kosong

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const updatedProject = await editData(`${apiUrl}/api/project`, {
        id: project?.id,
        name: projects.name,
        description: projects.description,
        image_url: projects.imageUrl,
        tech_stack: techStackArray,
        project_url: projects.projectUrl,
        repository_url: projects.repositoryUrl,
      });
      onUpdate(updatedProject.data);
      onClose();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>

          <table className="w-full flex flex-col py-4 gap-4">
            <tbody className="flex flex-col gap-4 py-4">
              {/* Name Row */}
              <tr className="">
                <td className="min-w-[100px] ">
                  <Label htmlFor="name">Name</Label>
                </td>
                <td className="text-center px-4">:</td>
                <td className="w-full">
                  <Input
                    id="name"
                    value={projects.name}
                    onChange={handleChange}
                    placeholder="Project Name"
                    type="text"
                    className="w-full"
                    required
                  />
                </td>
              </tr>

              {/* Description Row */}
              <tr className="">
                <td className="min-w-[100px] ">
                  <Label htmlFor="description">Description</Label>
                </td>
                <td className="text-center px-4">:</td>
                <td className="w-full">
                  <Input
                    id="description"
                    value={projects.description}
                    onChange={handleChange}
                    placeholder="Project Description"
                    type="text"
                    className="w-full"
                    required
                  />
                </td>
              </tr>

              {/* Image URL Row */}
              <tr className="">
                <td className="min-w-[100px] ">
                  <Label htmlFor="imageUrl">Image URL</Label>
                </td>
                <td className="text-center px-4">:</td>
                <td className="w-full">
                  <Input
                    id="imageUrl"
                    value={projects.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.png"
                    type="url"
                    className="w-full"
                    required
                  />
                </td>
              </tr>

              {/* Tech Stack Row */}
              <tr className="">
                <td className="min-w-[100px] ">
                  <Label htmlFor="techStack">Tech Stack</Label>
                </td>
                <td className="text-center px-4">:</td>
                <td className="w-full">
                  <Input
                    id="techStack"
                    value={projects.techStack}
                    onChange={handleChange}
                    placeholder="e.g., JavaScript, React\nOr each stack on a new line"
                    type="text"
                    className="w-full"
                    required
                  />
                </td>
              </tr>

              {/* Project URL Row */}
              <tr className="">
                <td className="min-w-[100px] ">
                  <Label htmlFor="projectUrl">Project URL</Label>
                </td>
                <td className="text-center px-4">:</td>
                <td className="w-full">
                  <Input
                    id="projectUrl"
                    value={projects.projectUrl}
                    onChange={handleChange}
                    placeholder="https://myawesomeproject.com"
                    type="url"
                    className="w-full"
                    required
                  />
                </td>
              </tr>

              {/* Repository URL Row */}
              <tr className="">
                <td className="min-w-[100px] ">
                  <Label htmlFor="repositoryUrl">Repo URL</Label>
                </td>
                <td className="text-center px-4">:</td>
                <td className="w-full">
                  <Input
                    id="repositoryUrl"
                    value={projects.repositoryUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/username/my-awesome-project"
                    type="url"
                    className="w-full"
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <DialogFooter>
            <Button type="submit">Edit Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
