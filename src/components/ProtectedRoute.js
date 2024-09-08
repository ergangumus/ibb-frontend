import React from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ component: Component }) => {
  const token = localStorage.getItem("accessToken");

  const checkToken = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/user/me/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      localStorage.setItem("user", JSON.stringify(response.data));
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  checkToken();
  return token ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
