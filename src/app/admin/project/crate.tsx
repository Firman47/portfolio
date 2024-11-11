"use client";

import { useState } from "react";
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

async function postData(url = "", data = {}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: Projects) => void;
}

const CreateProjectDialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [project, setProject] = useState({
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
    setProject((prevProject) => ({
      ...prevProject,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const techStackArray = project.techStack
        .split(/[\n,]+/) // Split berdasarkan koma atau newline
        .map((tech) => tech.trim()) // Hapus spasi kosong di setiap item
        .filter((tech) => tech); // Buang item kosong

      const newProject = await postData("http://localhost:3000/api/project", {
        name: project.name,
        description: project.description,
        image_url: project.imageUrl,
        tech_stack: techStackArray,
        project_url: project.projectUrl,
        repository_url: project.repositoryUrl,
      });
      onCreate(newProject.data);
      setProject({
        name: "",
        description: "",
        imageUrl: "",
        techStack: "",
        projectUrl: "",
        repositoryUrl: "",
      });
      onClose();
    } catch (error) {
      console.error("Error adding new project:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>

          <table className="w-full ">
            {/* Name Row */}
            <tbody className="flex flex-col gap-4 py-4">
              <tr className="">
                <td className="min-w-[100px] ">
                  <Label htmlFor="name">Name</Label>
                </td>
                <td className="text-center px-4">:</td>
                <td className="w-full">
                  <Input
                    id="name"
                    value={project.name}
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
                    value={project.description}
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
                    value={project.imageUrl}
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
                    value={project.techStack}
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
                    value={project.projectUrl}
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
                    value={project.repositoryUrl}
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
            <Button type="submit">Add Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
