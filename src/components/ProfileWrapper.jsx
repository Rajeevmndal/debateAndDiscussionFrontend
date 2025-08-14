import React, { useEffect, useState } from 'react';
import apiClient from '../apiClient'; // ✅ Use centralized client
import Profile from './Profile';

const ProfileWrapper = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/profile'); // ✅ Uses sessionStorage token
        setProfile(res.data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p style={styles.message}>Loading profile...</p>;
  if (error) return <p style={{ ...styles.message, color: 'red' }}>{error}</p>;

  return <Profile user={profile} />;
};

const styles = {
  message: {
    fontSize: '18px',
    textAlign: 'center',
    marginTop: '40px',
  },
};

export default ProfileWrapper;