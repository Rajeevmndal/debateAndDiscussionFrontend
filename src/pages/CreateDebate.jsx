import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../components/context/AppContext';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logo.jpg';
import apiClient from '../apiClient';

const CreateDebate = () => {
  const { backendURL } = useContext(AppContext);
  const navigate = useNavigate();

  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [debateId, setDebateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('create');

  const handleCreateDebate = async (e) => {
    e.preventDefault();
    if (!topic || !description || !debateId) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
     try {
      const response = await apiClient.post('/debates/create', {
        topic,
        description,
        debateId,
      });

      toast.success('Debate created successfully!');
      localStorage.setItem('newDebateId', response.data.debateId);
      navigate(`/room/${response.data.debateId}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create debate');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinDebate = async (e) => {
    e.preventDefault();
    if (!debateId) {
      toast.error('Please enter a Debate ID to join');
      return;
    }

    try {
      await apiClient.get(`/debates/${debateId}`);
      toast.success('Debate found!');
      navigate(`/room/${debateId}`);
    } catch (err) {
      toast.error(err?.response?.data || 'Debate not found');
    }
  };

  return (
    <div style={{ backgroundColor: '#f7f9fc', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <nav
        className="navbar navbar-expand-lg px-4 shadow-sm"
        style={{ backgroundColor: '#ffffff', borderBottom: '2px solid #4a90e2' }}
      >
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center gap-2"
          style={{ textDecoration: 'none' }}
        >
          <img
            src={logo}
            alt="logo"
            height={40}
            width={40}
            style={{
              borderRadius: '50%',
              border: '2px solid #4a90e2',
              boxShadow: '0 0 8px rgba(74, 144, 226, 0.4)',
            }}
          />
          <span className="fw-bold" style={{ color: '#2c3e50', fontSize: '1.5rem' }}>
            talk<span style={{ color: '#4a90e2' }}>ForOrAgainst</span>
          </span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/dashboard" style={{ color: '#4a90e2', fontWeight: 500 }}>
                Dashboard
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/profile" style={{ color: '#4a90e2', fontWeight: 500 }}>
                Profile
              </Link>
            </li>
           
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-semibold" style={{ color: '#2c3e50' }}>
            {mode === 'create' ? 'Create a New Debate' : 'Join an Existing Debate'}
          </h3>

          <button
            className="btn"
            style={{
              backgroundColor: '#4a90e2',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              fontWeight: '500',
              padding: '0.5rem 1.2rem',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#357ABD';
              e.target.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#4a90e2';
              e.target.style.transform = 'scale(1)';
            }}
            onClick={() => {
              setMode((prev) => (prev === 'create' ? 'join' : 'create'));
              setTopic('');
              setDescription('');
              setDebateId('');
            }}
          >
            {mode === 'create' ? 'Switch to Join' : 'Switch to Create'}
          </button>
        </div>

        <div
          className="card p-4 border-0 shadow-sm"
          style={{
            borderRadius: '1.5rem',
            backgroundColor: '#ffffffcc',
            backdropFilter: 'blur(8px)',
            border: '1px solid #dee2e6',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          {mode === 'create' ? (
            <form onSubmit={handleCreateDebate}>
              <div className="mb-3">
                <label className="form-label fw-medium text-secondary">Debate Topic</label>
                <input
                  type="text"
                  className="form-control"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Should AI replace humans?"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium text-secondary">Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Give some background or context"
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium text-secondary">Unique Debate ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={debateId}
                  onChange={(e) => setDebateId(e.target.value)}
                  placeholder="e.g. future-tech-2025"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn w-100"
                style={{
                  backgroundColor: '#4a90e2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '0.6rem 1.5rem',
                  fontWeight: '500',
                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                }}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Debate'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoinDebate}>
              <div className="mb-4">
                <label className="form-label fw-medium text-secondary">Enter Debate ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={debateId}
                  onChange={(e) => setDebateId(e.target.value)}
                  placeholder="e.g. climate2025"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn w-100"
                style={{
                  backgroundColor: '#50b5f2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '0.6rem 1.5rem',
                  fontWeight: '500',
                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                }}
              >
                Join Debate
              </button>
            </form>
          )}
       
        </div>
      </div>
    </div>
  );
};

export default CreateDebate;