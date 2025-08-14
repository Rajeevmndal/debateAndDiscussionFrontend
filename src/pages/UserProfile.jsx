// useProfile.js
import { useEffect, useState } from "react";
import apiClient from "../apiClient"; // ✅ Centralized Axios instance

const useProfile = () => {
  const [name, setName] = useState(null);

  useEffect(() => {
    apiClient
      .get("/profile")
      .then((res) => {
        setName(res.data.name); // ✅ Assuming response has `name` field
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setName("Guest"); // ✅ Fallback value
      });
  }, []);

  return name;
};

export default useProfile;