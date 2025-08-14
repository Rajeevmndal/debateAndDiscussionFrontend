import React from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiClient'; // ✅ Use centralized client
import { useContext } from 'react';
import { AppContext } from '../components/context/AppContext';




const Profile = ({ user }) => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      // await apiClient.post('/auth/logout');
      sessionStorage.clear(); // ✅ Clear sessionStorage instead of localStorage
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      alert(error.response?.data?.message || 'Logout failed. Please try again.');
    }
  };

  return (
    <div
      className="container py-5"
      style={{
        fontFamily: 'Poppins, sans-serif',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
      }}
    >
      {/* Title */}
      <div className="mb-4 text-center">
        <h2 className="fw-bold text-dark">Profile</h2>
        <p className="text-muted">Your personal information at a glance.</p>
      </div>

      {/* Card */}
      <div
        className="bg-white p-4 mx-auto shadow-sm"
        style={{
          maxWidth: '900px',
          borderRadius: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }}
      >
        <div className="row">
          <ProfileField label="User ID" value={user.userId} />
          <ProfileField label="Name" value={user.name} />
          <ProfileField label="Email" value={user.email} />
          
          <ProfileField
            label="Roles"
            value={user.roles?.map((r) => r.name || r).join(', ') || '—'}
          />
          {user.createdAt && (
            <ProfileField
              label="Created At"
              value={new Date(user.createdAt).toLocaleString()}
            />
          )}
          {user.updatedAt && (
            <ProfileField
              label="Updated At"
              value={new Date(user.updatedAt).toLocaleString()}
            />
          )}
          {user.verifyOtp && (
            <ProfileField label="Verification OTP" value={user.verifyOtp} />
          )}
          {user.verifyOtpExpireAt && (
            <ProfileField
              label="OTP Expiry"
              value={new Date(user.verifyOtpExpireAt).toLocaleString()}
            />
          )}
          {user.resetOtp && (
            <ProfileField label="Reset OTP" value={user.resetOtp} />
          )}
          {user.resetOtpExpireAt && (
            <ProfileField
              label="Reset Expiry"
              value={new Date(user.resetOtpExpireAt).toLocaleString()}
            />
          )}
        </div>

        {/* Bio Section */}
        {user.bio && (
          <div className="mt-4">
            <h6 className="fw-bold text-dark">Bio</h6>
            <p className="text-secondary">{user.bio}</p>
          </div>
        )}

        {/* Logout Button */}
        <div className="text-end mt-4 d-flex justify-content-end gap-3">
          <button
            className="btn btn-outline-secondary px-4 fw-semibold shadow-sm"
            style={{ borderRadius: '20px', fontFamily: 'Poppins, sans-serif' }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="col-md-6 mb-3">
    <h6 className="text-dark fw-semibold mb-1">{label}</h6>
    <p className="text-secondary">{value || '—'}</p>
  </div>
);

export default Profile;