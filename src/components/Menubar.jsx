import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-home.jpg';

const Menubar = () => {
  const navigate = useNavigate();

  return (
    <nav
      className="navbar px-4 py-3 d-flex justify-content-between align-items-center"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "2px solid #4a90e2",
        position: "sticky",
        top: "0",
        zIndex: "1000",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <img
          src={logo}
          alt="logo"
          width={44}
          height={44}
          style={{
            borderRadius: "50%",
            border: "2px solid #4a90e2",
          }}
        />
        <span
          className="fw-bold fs-4"
          style={{
            color: "#2c3e50",
            fontFamily: "'Segoe UI', sans-serif",
            letterSpacing: "1px",
          }}
        >
          talk<span style={{ color: "#4a90e2" }}>ForOrAgainst</span>
        </span>
      </div>

      <button
        className="btn rounded-pill px-4 py-2"
        style={{
          backgroundColor: "#4a90e2",
          color: "#fff",
          fontWeight: "600",
          border: "none",
          boxShadow: "0 0 6px rgba(74, 144, 226, 0.3)",
          transition: "all 0.3s ease",
        }}
        onClick={() => navigate("/login")}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#357ABD";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#4a90e2";
        }}
      >
        Login <i className="bi bi-arrow-right ms-2"></i>
      </button>
    </nav>
  );
};

export default Menubar;
