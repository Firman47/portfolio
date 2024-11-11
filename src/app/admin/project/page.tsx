"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { columns as columnsTemplate } from "./columns";
import { FaEdit } from "react-icons/fa";
import { Row } from "@tanstack/react-table";
import CreateProjectDialog from "./crate";
import EditProjectDialog from "./edit";
import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";
import DeleteProjectDialog from "./delete";
import { Projects } from "./types";

const Project = () => {
  const [data, setData] = useState<Projects[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Projects | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${apiUrl}/api/project`);
        const result = await response.json();
        setData(result.data as Projects[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreate = (newProject: Projects) => setData([...data, newProject]);

  const handleUpdate = (updatedProject: Projects) =>
    setData(
      data.map((proj) =>
        proj.id === updatedProject.id ? updatedProject : proj
      )
    );

  const handleEdit = (project: Projects) => {
    setSelectedProject(project);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (project: Projects) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleHapus = (deletedProject: Projects) => {
    setData(data.filter((proj) => proj.id !== deletedProject.id));
  };

  const columns = columnsTemplate.map((column) =>
    column.id === "actions"
      ? {
          ...column,
          cell: ({ row }: { row: Row<Projects> }) => (
            <div className="w-28">
              <Button
                size="icon"
                variant="link"
                onClick={() => handleEdit(row.original)}
              >
                <FaEdit />
              </Button>

              <Button
                size="icon"
                variant="link"
                onClick={() => handleDelete(row.original)}
              >
                <MdDelete />
              </Button>
            </div>
          ),
        }
      : column
  );

  return (
    <>
      <div className="container mx-auto py-4">
        <DataTable
          title="Table Project"
          columns={columns}
          data={data}
          isLoading={loading}
          dialog={() => setIsCreateDialogOpen(true)}
        />
      </div>

      <CreateProjectDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreate={handleCreate}
      />

      {selectedProject && (
        <>
          <DeleteProjectDialog
            isOpen={isDeleteDialogOpen}
            project={selectedProject}
            onDelete={handleHapus}
            onClose={() => setIsDeleteDialogOpen(false)}
          />

          <EditProjectDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            project={selectedProject}
            onUpdate={handleUpdate}
          />
        </>
      )}
    </>
  );
};

export default Project;
