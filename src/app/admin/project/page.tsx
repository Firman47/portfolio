"use client";

import { useEffect, useState } from "react";
interface Posts {
  id: string;
  name: string;
  descriiption: string;
}
const Project = () => {
  const [posts, setPosts] = useState<Posts[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/api/project");
      const result = await response.json();

      // Ambil data dari response JSON sesuai struktur
      setPosts(result.data as Posts[]); // 'result.data' adalah array yang berisi objek 'id', 'descriiption', dan 'name'
    };

    fetchData();
  }, []);

  return (
    <>
      {Array.isArray(posts) ? (
        posts.map((item) => (
          <div key={item.id}>
            <p>ID: {item.id}</p>
            <p>Name: {item.name}</p>
            <p>Description: {item.descriiption}</p>
          </div>
        ))
      ) : (
        <p>No posts available</p>
      )}
    </>
  );
};

export default Project;
