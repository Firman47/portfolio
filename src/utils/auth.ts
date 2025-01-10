import axios from "axios";
const url = `${process.env.NEXT_PUBLIC_API_URL}`;

export interface SignUpType {
  username: string;
  full_name: string;
  email: string;
  password: string;
}

export interface LoginType {
  username: string;
  username_or_email: string;
  email: string;
  password: string;
}

export interface verificationEmailType {
  email: string;
  code: string;
}

export const SignUp = async (req: SignUpType) => {
  try {
    const response = await axios.post(`${url}/api/auth/signup`, req);

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      console.error("Error occurred during login", error);
    }
    throw error;
  }
};

export const LogIn = async (req: LoginType) => {
  try {
    const response = await axios.post(`${url}/api/login`, req);

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      console.error("Error occurred during login", error);
    }
    throw error;
  }
};

export const GetByEmail = async (email: string) => {
  try {
    const response = await axios.get(`${url}/api/auth/signup?email=${email}`);

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
      console.error("Error occurred during login", error);
    }
    throw error;
  }
};

export const verificationEmail = async (req: verificationEmailType) => {
  try {
    const response = await axios.put(
      `${url}/api/auth/signup?email=${req.email}&code=${req.code}`
    );

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
      console.error("Error occurred during login", error);
    }
    throw error;
  }
};

export const resendVerification = async (email: string) => {
  try {
    const response = await axios.post(
      `${url}/api/auth/resend-verification?email=${email}`
    );

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
      console.error("Error occurred during login", error);
    }
    throw error;
  }
};

export const deleteCockies = async () => {
  try {
    const response = await axios.post(`${url}/api/auth/delete-cockies`);

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
      console.error("Error occurred during login", error);
    }
    throw error;
  }
};

export const deleteAccount = async (email: string) => {
  try {
    const response = await axios.delete(
      `${url}/api/auth/signup?email=${email}`
    );

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
      console.error("Error occurred during login", error);
    }
    throw error;
  }
};
