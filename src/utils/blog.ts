import axios from "axios";
const url = `${process.env.NEXT_PUBLIC_API_URL}/api/blog`;

type statusBlog = "draft" | "published" | "deleted";

export interface ProjectType {
  id: string;
  title: string;
  content: string;
  status: statusBlog;
  category_id: string[];
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
    const response = await axios.post(url, req);
    return response.data;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};

export const PUT = async (req: ProjectType) => {
  try {
    const response = await axios.put(url, req);

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
