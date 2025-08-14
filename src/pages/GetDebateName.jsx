// useDebateName.js
import { useEffect, useState } from "react";
import apiClient from "../apiClient"; // ✅ Import centralized Axios instance

const useDebateName = (debateId) => {
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    if (!debateId) return;

    apiClient
      .get(`/debates/${debateId}`)
      .then((res) => {
        setTopic(res.data.topic); // ✅ matches your Debate entity
      })
      .catch((error) => {
        console.error("Error fetching debate topic:", error);
        setTopic("Unknown Topic");
      });
  }, [debateId]);

  return topic;
};

export default useDebateName;