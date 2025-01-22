import axios from "axios";
const url = `${process.env.NEXT_PUBLIC_API_URL}/api/action`;

type content_type = "blog" | "project" | "comment";

export interface LikeType {
  user_id: string;
  content_id: string;
  content_type: content_type;
}

export interface CommentType {
  user_id?: string;
  parent_id?: string;
  content_id: string;
  content_type: content_type;
  text?: string;
}

export const GetLike = async (req: LikeType) => {
  try {
    const response = await axios.get(
      `${url}/like?user_id=${req.user_id}&content_id=${req.content_id}&content_type=${req.content_type}`
    );
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

export const Like = async (req: LikeType) => {
  try {
    const response = await axios.post(`${url}/like`, req);
    return response.data;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};

export const addComment = async (req: CommentType) => {
  try {
    const response = await axios.post(`${url}/comment`, req);
    return response.data;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};

export const getComment = async (req: CommentType) => {
  try {
    const response = await axios.get(
      `${url}/comment?content_id=${req.content_id}&content_type=${req.content_type}`
    );
    return response.data;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};
