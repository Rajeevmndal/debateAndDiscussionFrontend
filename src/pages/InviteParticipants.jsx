import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AppContext } from '../components/context/AppContext';
import apiClient from '../apiClient';
import logo from '../assets/logo.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

const InviteParticipants = () => {
  const { backendURL } = useContext(AppContext);
  const { debateId } = useParams();
  const [emails, setEmails] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navigate = useNavigate();

  const toggleNavbar = () => setIsNavCollapsed(!isNavCollapsed);

  useEffect(() => {
    if (!debateId) {
      toast.error('No debate found. Please create one first.');
      navigate('/');
    }
  }, [debateId, navigate]);

  const handleInvite = async (e) => {
    e.preventDefault();

    const emailList = emails
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email !== '');

    if (!emailList.length) {
      toast.error('Please enter at least one email ID');
      return;
    }

    setLoading(true);
    try {
     const response = await apiClient.post(
    `/debates/${debateId}/invite`,
    emailList,
    {
      timeout: 30000, // ⏱️ Increase timeout to 30 seconds
    }
  );

      const successMessage = response?.data?.message || 'Users invited successfully';
      toast.success(successMessage);

      setEmails('');
      navigate(`/room/${debateId}`);
    } catch (err) {
      console.error('Invite error:', err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data ||
        'Failed to invite users';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
              <Link className="nav-link" to="/notifications" style={{ color: '#4a90e2', fontWeight: 500 }}>
                Notification
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/profile" style={{ color: '#4a90e2', fontWeight: 500 }}>
                Profile
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/settings" style={{ color: '#4a90e2', fontWeight: 500 }}>
                Setting
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Invite Form */}
      <div className="container mt-5">
        <h3 className="fw-semibold text-dark mb-4 text-center">📨 Invite Participants</h3>
        <form
          onSubmit={handleInvite}
          className="p-4 shadow-sm bg-white rounded"
          style={{ maxWidth: '600px', margin: '0 auto' }}
        >
          <div className="mb-3">
            <label className="form-label fw-bold text-secondary">Email IDs (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="e.g., alice@example.com, bob@example.com"
              style={{ borderRadius: '12px' }}
            />
          </div>
          <button
            type="submit"
            className="btn w-100 py-2"
            disabled={loading}
            style={{
              backgroundColor: '#4a90e2',
              color: '#fff',
              borderRadius: '50px',
              fontWeight: 600,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#357ABD')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#4a90e2')}
          >
            {loading ? 'Inviting...' : 'Invite'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteParticipants;