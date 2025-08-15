import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import useProfile from "./UserProfile";
import logo from '../assets/logo.jpg'; // ✅ Importing the logo
import apiClient from '../apiClient'; // adjust path if needed
const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [participatedDebates, setParticipatedDebates] = useState([]);
  const [countDebate, setDebateCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const username = useProfile();

  const toggleNavbar = () => setIsNavCollapsed(!isNavCollapsed);

  useEffect(() => {
    fetch('/mock-data.json')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

 useEffect(() => {
  apiClient.get('/debates/debateCount')
    .then(res => setDebateCount(res.data))
    .catch(console.error);
}, []);

useEffect(() => {
  apiClient.get('/posts/commentCount')
    .then(res => setCommentCount(res.data))
    .catch(console.error);
}, []);

useEffect(() => {
  apiClient.get('/debates/my-participated')
    .then(res => setParticipatedDebates(res.data))
    .catch(console.error);
}, []);

  const handleDropdownChange = (e) => {
    const debateId = e.target.value;
    if (debateId) {
      navigate(`/room/${debateId}`);
    }
  };

  if (!data) return <div className="text-center mt-5">Loading...</div>;

  const { user, stats, activities, debates } = data;

  return (
    <div style={{ backgroundColor: '#f7f9fc', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      
      {/* Navbar */}
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

        <button className="navbar-toggler" type="button" onClick={toggleNavbar}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse justify-content-end`}>
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

      {/* Welcome Banner */}
      <div className="text-center mt-5 mb-4">
        <h2 className="fw-semibold" style={{ color: '#2c3e50' }}>Welcome back, {username}</h2>
        <p className="text-muted">Engage, explore, and energize the debate space.</p>
      </div>

      <div className="container">

        {/* Stats Cards */}
        <div className="row justify-content-center text-center mb-5">
          <div className="col-md-3 mb-4">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <div className="card-body">
                <h5 className="card-title fw-bold text-primary">{countDebate}</h5>
                <p className="card-text text-secondary">Debate Created</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <div className="card-body">
                <h5 className="card-title fw-bold text-primary">{commentCount}</h5>
                <p className="card-text text-secondary">Comment Posted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="row mb-5">
          <div className="col-md-6 mb-3">
            <button
              className="btn w-100 py-2"
              style={{
                backgroundColor: '#4a90e2',
                color: '#fff',
                borderRadius: '50px',
                fontWeight: 600,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
              }}
              onClick={() => navigate('/create-debate')}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#357ABD'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#4a90e2'}
            >
              Start New Debate
            </button>
          </div>
          <div className="col-md-6">
            <button
              className="btn btn-outline-dark w-100 py-2"
              style={{
                borderRadius: '50px',
                fontWeight: 500,
              }}
              onClick={() => navigate('/debatePage')}
            >
              Browse Categories
            </button>
          </div>
        </div>

        {/* Participated Debates */}
        <div className="d-flex justify-content-center">
  <div className="mb-5 mt-4 text-center" style={{ width: '100%', maxWidth: '500px' }}>
    <label
      htmlFor="participatedDropdown"
      className="form-label fw-bold text-dark"
      style={{ fontSize: '1.3rem', display: 'block' }}
    >
      Debates You're Invited To
    </label>

    {participatedDebates.length === 0 ? (
      <div className="text-muted">You're not invited to any debates yet.</div>
    ) : (
      <select
        id="participatedDropdown"
        className="form-select shadow-sm"
        style={{ borderRadius: '12px' }}
        onChange={handleDropdownChange}
      >
        <option value="">Select a debate</option>
        {participatedDebates.map((debate) => (
          <option key={debate.id} value={debate.id}>
            {debate.topic}
          </option>
        ))}
      </select>
    )}
  </div>
</div>
      </div>
    </div>
  );
};

export default Dashboard;