import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../components/context/AppContext';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { backendURL } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      toast.warn('Please enter your email first');
      return;
    }

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${backendURL}/send-reset-opt`, null, {
        params: { email },
      });

      if (response.status === 200) {
        toast.success('OTP sent to your email');
      } else {
        toast.error('Failed to send OTP');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error sending OTP');
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    setLoading(true);
    try {
      const response = await axios.post(`${backendURL}/reset-password`, {
        email,
        otp,
        newPassword,
      });

      if (response.status === 200) {
        toast.success('Password reset successful');
        navigate('/');
      } else {
        toast.error('Unable to reset password');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
      style={{ background: 'linear-gradient(90deg, #6a5af9, #8268f9)' }}
    >
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
            gap: '5px',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: '24px',
            textDecoration: 'none',
          }}
        >
          <img src={logo} alt="logo" height={32} width={32} />
          <span className="fw-bold fs-4 text-dark">talkForOrAgainst</span>
        </Link>
      </div>

      <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Reset Password</h2>

        <form onSubmit={handleReset}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Id</label>
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
            <label htmlFor="otp" className="form-label">OTP</label>
            <input
              type="text"
              id="otp"
              className="form-control"
              placeholder="Enter OTP received on email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <div className="text-end mt-1">
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={handleSendOtp}
                style={{
                  fontWeight: '500',
                  color: '#6a5af9',
                  textDecoration: 'none',
                }}
              >
                Send OTP
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <input
              type="password"
              id="newPassword"
              className="form-control"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;