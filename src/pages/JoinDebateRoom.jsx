import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const JoinDebateRoom = () => {
  const [debateId, setDebateId] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!debateId.trim()) {
      toast.error("Please enter a Debate ID");
      return;
    }

    // ✅ Navigate to frontend route, not API path
    navigate(`/room/${debateId}`);
  };

  return (
    <div className="container my-5">
      <h3>Join a Debate Room</h3>
      <div className="mb-3">
        <label className="form-label">Debate ID</label>
        <input
          type="text"
          className="form-control"
          value={debateId}
          onChange={(e) => setDebateId(e.target.value)}
          placeholder="Enter the Debate ID"
          required
        />
      </div>
      <button className="btn btn-success" onClick={handleJoin}>
        Join Room
      </button>
    </div>
  );
};

export default JoinDebateRoom;