// useEmail.js
import { useEffect, useState } from "react";
import apiClient from "../apiClient"; // ✅ Import your Axios instance

const useEmail = () => {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    apiClient
      .get("/profile")
      .then((res) => {
        setEmail(res.data.email); // ✅ Assuming response has `email` field
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setEmail("Guest"); // ✅ Fallback value
      });
  }, []);

  return email;
};

export default useEmail;