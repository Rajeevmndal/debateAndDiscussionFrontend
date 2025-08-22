import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProfile from "./UserProfile";
import getDebateName from "./GetDebateName";
import apiClient from "../apiClient";
import { toast } from "react-toastify";

const DebateRoom = () => {
  const username = useProfile();
  const { debateId } = useParams();
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const [userSide, setUserSide] = useState(""); // "for" or "against"
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [debateTopic, setDebateTopic] = useState(getDebateName(debateId));
  const [debateTimer, setDebateTimer] = useState(null); // { start, end }
  const [timeLeft, setTimeLeft] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [debateFeedback, setDebateFeedback] = useState(null);
  const [debateEnded, setDebateEnded] = useState(false);
  const [temp,setTemp]=useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartDebate = async () => {
    const duration = prompt("Enter debate duration in minutes:");
    if (!duration || isNaN(duration)) return toast.error("Invalid duration");

    try {
      await apiClient.post(`/debates/${debateId}/start`, { duration: parseInt(duration) });
      toast.success("Debate started!");
    } catch (err) {
      toast.error(err?.response?.data || "Failed to start debate");
    }
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
  if (debateFeedback) {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [debateFeedback]);

  // ✅ Hydrate timer from sessionStorage on page load
  useEffect(() => {
    const stored = sessionStorage.getItem(`timer-${debateId}`);
    if (stored) {
      const { start, end } = JSON.parse(stored);
      setDebateTimer({
        start: new Date(start),
        end: new Date(end)
      });
    }
  }, [debateId]);

  // ✅ Countdown logic
  useEffect(() => {
    if (!debateTimer) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, debateTimer.end - now);
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft(null);
        setDebateTimer(null);
        setDebateEnded(true); // ✅ Mark debate as ended
        sessionStorage.removeItem(`timer-${debateId}`); // ✅ Clear timer

        console.log("End time from backend:", debateTimer.end);
console.log("Local now:", new Date());

         // ✅ Unlock debate via API
  apiClient.post(`/debates/${debateId}/unlock`)
    .then(() => console.log("Debate unlocked"))
    .catch((err) => console.error("Failed to unlock debate", err));


    // ✅ Trigger analysis
apiClient.post(`/api/debate/${debateId}/analyze`)
  .then(() => console.log("Analysis triggered"))
  .catch((err) => console.error("Failed to trigger analysis", err));

        toast.info("Debate time is over!");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [debateTimer]);

  useEffect(() => {
    if (!username) return;

    apiClient.get(`/debates/${debateId}/metadata`)
  .then((res) => {
    const data = res.data;
    setIsOwner(data.ownerUsername === username);
    setDebateTopic(data.topic);
  })
  .catch((err) => {
    console.error("Failed to fetch metadata", err.response?.status, err.response?.data);
    if (!debateTopic || debateTopic === getDebateName(debateId)) {
      setDebateTopic(getDebateName(debateId));
    }
  });

    apiClient
      .get(`/messages/by-debate/${debateId}`)
      .then((res) => {
        const transformed = res.data.map((msg) => ({
          ...msg,
          content: msg.message,
          side: msg.role,
          sender: msg.senderUsername,
        }));
        setMessages(transformed);
      })
      .catch((err) => console.error("Failed to load message history", err));

    const token = sessionStorage.getItem("jwt");
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(
      `wss://debateanddiscussion-deployment-5.onrender.com/api/v1.0/ws?token=${token}`
    );
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected");

      const joinPayload = {
        type: "join",
        username,
        debateId,
      };
      socket.send(JSON.stringify(joinPayload));
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "activeUsers") {
        setActiveUsers(msg.users);
      } else {
        setMessages((prev) => [...prev, msg]);
      }

   if (msg.type === "analysis") {
  try {
    const parsed = typeof msg.content === "string"
      ? JSON.parse(msg.content)
      : msg.content;

    const rawText = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (rawText) {
      setDebateFeedback(rawText);
      
    } else {
      console.warn("No feedback text found in analysis payload", parsed);
      setDebateFeedback("No feedback available.");
    }
  } catch (err) {
    console.error("Failed to parse analysis payload", err);
    setDebateFeedback("No feedback available.");
  }
  return;
}

      if (msg.type === "timer") {
  const now = Date.now(); // UTC timestamp in ms
  const start = new Date(now); // ✅ Declare start as Date object
  const end = new Date(start.getTime() + msg.duration * 60000); // ✅ Add duration

  console.log("Received timer payload:", msg);
  console.log("Parsed start:", start.toISOString());
  console.log("Parsed end:", end.toISOString());
  console.log("Local now:", new Date().toISOString());

  sessionStorage.setItem(`timer-${debateId}`, JSON.stringify({
    start: start.toISOString(),
    end: end.toISOString()
  }));  

        // ✅ Clear stale messages and re-fetch fresh ones
  apiClient.get(`/messages/by-debate/${debateId}`)
    .then((res) => {
      const transformed = res.data.map((msg) => ({
        ...msg,
        content: msg.message,
        side: msg.role,
        sender: msg.senderUsername,
      }));
      setMessages(transformed); // ✅ UI now reflects DB state
    })
    .catch((err) => console.error("Failed to reload messages", err));

        setDebateTimer({ start, end });
        toast.info(`Debate started! Duration: ${msg.duration} minutes`);
      }
    };

    socket.onerror = (error) => console.error("WebSocket error:", error);
    socket.onclose = () => console.log("❌ WebSocket closed");

    return () => socket.close();
  }, [debateId, username]);

  const sendMessage = () => {
    if (inputMsg.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
      const msgObj = {
        type: "chat",
        debateId,
        sender: username,
        role: userSide,
        message: inputMsg,
      };
      socketRef.current.send(JSON.stringify(msgObj));
      setInputMsg("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleSideSelect = (side) => setUserSide(side);
  const handleInviteClick = () => navigate(`/invite/${debateId}`);

  const exitRoom = () => {
    if (window.confirm("Are you sure you want to leave the debate?")) {
      socketRef.current?.close();
      navigate("/dashboard");
    }
  };

  const forMessages = messages.filter((msg) => msg.side === "for");
  const againstMessages = messages.filter((msg) => msg.side === "against");

  const panelStyle = {
    height: "320px",
    overflowY: "auto",
    backgroundColor: "#ffffff",
    border: "1px solid #dee2e6",
    borderRadius: "1rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    padding: "1rem",
  };

  return (
    <div
      className="container-fluid py-4"
      style={{
        backgroundColor: "#f7f9fc",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-4">
        <div className="text-secondary fw-medium">
          <strong>Debate ID:</strong> {debateId}
        </div>
        <h4 className="text-primary text-center m-0">{debateTopic}</h4>
        <div className="text-end">
          <div className="text-secondary fw-medium">
            <strong>User:</strong> {username}
          </div>
          <button
            className="btn btn-outline-dark btn-sm mt-1"
            onClick={exitRoom}
            style={{ borderRadius: "30px" }}
          >
            Exit
          </button>
        </div>
      </div>

      {/* Active Users Dropdown */}
    {userSide && (
  <div className="px-4 mb-3 d-flex align-items-center justify-content-between">
    {/* Active Users Dropdown - Left */}
   <div style={{ maxWidth: "250px" }} className="d-flex align-items-center gap-2">
  <label className="fw-semibold text-dark mb-0">Active Users:</label>
  <select className="form-select" style={{ borderRadius: "30px", width: "auto" }}>
    {activeUsers.map((user, idx) => (
      <option key={idx} value={user}>
        {user}
      </option>
    ))}
  </select>
</div>

    {/* Timer Display - Right */}
    {/* Timer Display - Right */}
    <div className="text-end">
      {timeLeft ? (
        <h5
          style={{
            color: "#4a90e2",
            fontWeight: "bold",
            fontSize: "1.5rem",
            marginBottom: 0,
          }}
        >
          Time Remaining: {timeLeft}
        </h5>
      ) : debateEnded ? (
        <h5
          style={{
            color: "#4a90e2",
            fontWeight: "bold",
            fontSize: "1.5rem",
            marginBottom: 0,
          }}
        >
          Please wait for analysis...
        </h5>
      ) : temp ? (
        <h5
          style={{
            color: "#4a90e2",
            fontWeight: "bold",
            fontSize: "1.5rem",
            marginBottom: 0,
          }}
        >
          About to start...
        </h5>
      ) : null}
    </div>
  </div>
)}

      {/* Side selection */}
      {!userSide && (
        <div className="mb-4 text-center">
          <h5 className="fw-semibold text-dark mb-3">Choose your side</h5>
          <button
            className="btn mx-2 px-4 py-2"
            style={{
              backgroundColor: "#4a90e2",
              color: "#fff",
              borderRadius: "30px",
              fontWeight: "500",
              
            }}
            onClick={() => handleSideSelect("for")}
          >
            For
          </button>
          <button
            className="btn mx-2 px-4 py-2"
            style={{
              backgroundColor: "#4a90e2",
                            color: "#fff",
              borderRadius: "30px",
              fontWeight: "500",
              
            }}
            onClick={() => handleSideSelect("against")}
          >
            Against
          </button>

              {/* 🔥 Add Delete Button Here */}
    {isOwner && (
      <button
        className="btn mt-4 px-4 py-2"
        style={{
          backgroundColor: "#4a90e2",
          color: "#fff",
          borderRadius: "30px",
          fontWeight: "500",
        }}
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this debate?")) {
            apiClient
              .delete(`/debates/${debateId}`)
              .then(() => {
                toast.success("Debate deleted successfully");
                navigate("/dashboard");
              })
              .catch((err) => {
                toast.error(err?.response?.data || "Failed to delete debate");
              });
          }
        }}
      >
        Delete Debate
      </button>
    )}
        </div>
      )}

      {/* Chat panels */}
      {userSide && (
        <>
          <div className="row mb-4 px-4">
            <div className="col-md-6 mb-3">
              <h5 className="fw-semibold text-primary text-center mb-2">For</h5>
              <div style={panelStyle}>
                {forMessages.map((msg, idx) => (
                  <div key={idx} className="mb-2">
                    <strong>{msg.sender}:</strong> {msg.content}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <h5 className="fw-semibold text-primary text-center mb-2">Against</h5>
              <div style={panelStyle}>
                {againstMessages.map((msg, idx) => (
                  <div key={idx} className="mb-2">
                    <strong>{msg.sender}:</strong> {msg.content}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="input-group px-4">
            <input
              className="form-control"
              placeholder="Type your message..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                borderRadius: "30px 0 0 30px",
                backgroundColor: "#fff",
                border: "1px solid #ced4da",
              }}
            />
            <button
              className="btn"
              onClick={sendMessage}
              style={{
                backgroundColor: "#4a90e2",
                color: "#fff",
                borderRadius: "0 30px 30px 0",
                fontWeight: "500",
              }}
            >
              Send
            </button>
          </div>
        </>
      )}

      <div ref={messagesEndRef} />

       {/* Start Debate Button */}
      {userSide && isOwner && (
  <button
    className="btn mt-3"
    onClick={handleStartDebate}
    style={{
      backgroundColor: "#4a90e2",
      color: "#fff",
      borderRadius: "30px",
      fontWeight: "600",
      
    }}
  >
    Start Debate
  </button>
)}

{!debateTimer && debateFeedback && (
  <div style={{
    backgroundColor: "#f9fafb",
    borderLeft: "6px solid #40b0ddff",
    padding: "1.5rem",
    marginTop: "2rem",
    borderRadius: "0.75rem",
    fontFamily: "Segoe UI, sans-serif",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  }}>
    <h3 style={{ marginBottom: "1rem", color: "#40b0ddff" }}>🧠 Debate Analysis</h3>

    {debateFeedback.split("\n\n").map((section, idx) => {
      const titleMatch = section.match(/^(Critique:|Scores:|Summary:|Conversational Summary:|Tweet Summary:)/);
      const title = titleMatch?.[1];
      const content = section.replace(title, "").trim();

      const titleMap = {
        "Critique:": "Critique",
        "Scores:": "Scores",
        "Summary:": "Summary",
        "Conversational Summary:": "Conversational Summary",
        "Tweet Summary:": "Tweet Summary"
      };

      return (
        <div key={idx} style={{ marginBottom: "1.25rem" }}>
          {title && (
            <h4 style={{ marginBottom: "0.5rem", color: "#333" }}>
              {titleMap[title]}
            </h4>
          )}
          <pre style={{
            fontSize: "0.95rem",
            lineHeight: "1.6",
            whiteSpace: "pre-wrap",
            margin: 0
          }}>
            {content}
          </pre>
        </div>
      );
    })}
  </div>
)}

      {/* Floating Invite Button */}
      {!userSide &&(
      <button
        onClick={handleInviteClick}
        className="btn position-fixed"
        style={{
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          backgroundColor: "#4a90e2",
          color: "#fff",
          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
          zIndex: 1000,
        }}
        title="Invite Participants"
      >
        +
      </button>)}
    </div>
  );
};

export default DebateRoom;