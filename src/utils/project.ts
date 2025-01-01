import axios from "axios";
const url = `${process.env.NEXT_PUBLIC_API_URL}/api/project`;

export interface ProjectType {
  id: string;
  name: string;
  description: string;
  image: File | string;
  tech_stack: string;
  project_url: string;
  repository_url: string;
  old_image: string;
}

export const get = async () => {
  try {
    const response = await axios.get(`${url}`);
    return response.data;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};

export const getById = async (id: string) => {
  try {
    const response = await axios.get(`${url}?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};

export const POST = async (req: ProjectType) => {
  try {
    const formData = new FormData();
    formData.append("name", req.name);
    formData.append("description", req.description);

    formData.append("image", req.image);

    formData.append("tech_stack", JSON.stringify(req.tech_stack));
    formData.append("project_url", req.project_url);
    formData.append("repository_url", req.repository_url);

    const response = await axios.post(url, req, {
      headers: {
        "Content-Type": "multipart/form-data", // pastikan ini di-set saat menggunakan FormData
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};

export const PUT = async (req: ProjectType) => {
  try {
    const formData = new FormData();
    formData.append("id", req.id);
    formData.append("name", req.name);
    formData.append("description", req.description);

    if (req.image) {
      formData.append("image", req.image);
    }

    formData.append("tech_stack", req.tech_stack);
    formData.append("project_url", req.project_url);
    formData.append("repository_url", req.repository_url);

    if (req.old_image) {
      formData.append("old_image", req.old_image);
    }

    const response = await axios.put(url, req, {
      headers: {
        "Content-Type": "multipart/form-data", // pastikan ini di-set saat menggunakan FormData
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};

export const DELETE = async (id: Array<string>) => {
  try {
    const response = await axios.delete(url, { data: { id } });
    return response.data;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};
