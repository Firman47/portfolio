import axios from "axios";
const url = `${process.env.NEXT_PUBLIC_API_URL}/api/home/blog`;

export const get = async () => {
  try {
    const response = await axios.get(`${url}`);
    return response.data;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};

export const getBySlug = async (slug: string) => {
  try {
    const response = await axios.get(`${url}?slug=${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};
