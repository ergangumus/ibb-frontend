import axios from "axios";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post("http://localhost:8000/api/user/token/", {
      email,
      password,
    });
    return response.data.token;
  } catch (error) {
    throw new Error("Login failed");
  }
};
