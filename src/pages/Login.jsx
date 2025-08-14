import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../components/context/AppContext';

const Login = () => {
  const [isCreateAccount, setIsCreateAccount] = useState(true);
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { backendURL, setIsLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    setLoading(true);
    try {
      if (isCreateAccount) {
        const response = await axios.post(`${backendURL}/register`, {
          name,
          email,
          password,
          role,
        });
        if (response.status === 201) {
          navigate('/');
          toast.success('User registered successfully');
        } else {
          toast.error('User already exists');
        }
      } else {
        const response = await axios.post(`${backendURL}/login`, {
          email,
          password,
        });
        if (response.status === 200) {
          sessionStorage.setItem('jwt', response.data.token);
          setIsLoggedIn(true);
          navigate('/dashboard');
          toast.success('Login successful');
        } else {
          toast.error('Invalid credentials');
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: 'linear-gradient(to bottom right, #f8f9fa, #e8f0ff)',
        fontFamily: 'Poppins, sans-serif',
        padding: '2rem',
      }}
    >
      {/* Logo Top Left */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '30px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
          }}
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
          <span className="fw-bold fs-4" style={{ color: '#2c3e50' }}>
            talk<span style={{ color: '#4a90e2' }}>ForOrAgainst</span>
          </span>
        </Link>
      </div>

      {/* Card Form */}
      <div
        className="card shadow"
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '16px',
          padding: '2rem',
          backgroundColor: '#ffffffcc',
          backdropFilter: 'blur(8px)',
          border: '1px solid #dee2e6',
        }}
      >
        <h2 className="text-center mb-4" style={{ color: '#2c3e50' }}>
          {isCreateAccount ? 'Create Account' : 'Login'}
        </h2>

        <form onSubmit={handleSubmit}>
          {isCreateAccount && (
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isCreateAccount && (
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Select Role</label>
              <select
                id="role"
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Choose a role</option>
                <option value="USER">User</option>
                <option value="MODERATOR">Moderator</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          )}

          <div className="d-flex justify-content-between mb-3">
            <Link to="/reset-password" className="text-decoration-none" style={{ color: '#4a90e2' }}>
              Forgot password?
            </Link>
            <span
              style={{ cursor: 'pointer', color: '#4a90e2' }}
              onClick={() => setIsCreateAccount(!isCreateAccount)}
            >
              {isCreateAccount ? 'Already have an account?' : 'New user? Sign up'}
            </span>
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
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#357ABD';
              e.target.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#4a90e2';
              e.target.style.transform = 'scale(1)';
            }}
          >
            {loading ? 'Loading...' : isCreateAccount ? 'Sign Up' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
