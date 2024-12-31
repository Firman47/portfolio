import axios from "axios";
const url = `${process.env.NEXT_PUBLIC_API_URL}/api/category`;

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

export const POST = async (req: { name: string }) => {
  try {
    const response = await axios.post(url, req);
    return response.data;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};

export const PUT = async (req: { id: string; name: string }) => {
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
