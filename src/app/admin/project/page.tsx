"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
interface Posts {
  id: string;
  name: string;
  descriiption: string;
}
const Project = () => {
  const [data, setData] = useState<Posts[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/project");
        const result = await response.json();

        setData(result.data as Posts[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="container mx-auto py-4">
        <DataTable columns={columns} data={data} isLoading={loading} />
      </div>
    </>
  );
};

export default Project;
