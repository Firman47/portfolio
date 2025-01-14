import axios from "axios";
const url = `${process.env.NEXT_PUBLIC_API_URL_REAL_TIME}/api`;

type content_type = "blog" | "project";

export interface LikeType {
  user_id: string;
  content_id: string;
  content_type: content_type;
}

export interface getLikeType {
  content_id: string;
  content_type: content_type;
}

export const Like = async (req: LikeType) => {
  try {
    const response = await axios.post(`${url}/like`, req);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};

export const GetLikeByUser = async (req: LikeType) => {
  try {
    const response = await axios.post(`${url}/getLikeByUser`, req);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};

export const GetLike = async (req: getLikeType) => {
  try {
    const response = await axios.post(`${url}/getLike`, req);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};
