import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import header from '../assets/header.avif';

const Header = () => {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState('');
  const fullText = "Welcome to our product";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e0e0e0',
        padding: '3rem 2rem',
        maxWidth: '800px',
        margin: '3rem auto',
        textAlign: 'center',
        fontFamily: 'Poppins, sans-serif',
        color: '#2c3e50'
      }}
    >
      <img
        src={header}
        alt="Welcome"
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          marginBottom: '1.5rem',
          border: '2px solid #4a90e2',
        }}
      />

      <h5 style={{ color: '#20c997', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
        Hey creators 
      </h5>

      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 700,
        marginBottom: '1rem',
        minHeight: '60px'
      }}>
        {displayText}
        <span style={{
          borderRight: '2px solid #4a90e2',
          animation: 'blink 1s infinite',
          marginLeft: '4px'
        }}>|</span>
      </h1>

      <p style={{
        color: '#5f6f81',
        fontSize: '1.1rem',
        maxWidth: '500px',
        margin: '0 auto 2rem'
      }}>
        Let’s start with a quick product tour and set up the authentication in no time!
      </p>

      <button
        onClick={() => navigate('/login')}
        style={{
          backgroundColor: '#4a90e2',
          color: 'white',
          border: 'none',
          padding: '0.7rem 2.2rem',
          borderRadius: '50px',
          fontSize: '1rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background-color 0.3s ease, transform 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#357ABD';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#4a90e2';
          e.target.style.transform = 'scale(1)';
        }}
        title="Start your journey"
      >
        Get Started
      </button>

      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}
      </style>
    </header>
  );
};

export default Header;
