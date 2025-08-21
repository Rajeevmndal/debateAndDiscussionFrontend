import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import apiClient from "../../apiClient"; // ✅ Replaced fetch with apiClient

const PublicDebateList = () => {
  const [debates, setDebates] = useState([]);
  const [filteredDebates, setFilteredDebates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [newDebateId, setNewDebateId] = useState("");
  const [newDebateTitle, setNewDebateTitle] = useState("");
  const [newDebateDesc, setNewDebateDesc] = useState("");
  const [newDebateCategory, setNewDebateCategory] = useState("");

  const [isAdmin, setIsAdmin] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get("/public-debates")
      .then((res) => {
        setDebates(res.data);
        setFilteredDebates(res.data);
      })
      .catch((err) => console.error("Error fetching debates:", err));
  }, []);

  const createDebate = () => {
    apiClient.post("/public-debates/create", {
      debateId: newDebateId,
      title: newDebateTitle,
      description: newDebateDesc,
      category: newDebateCategory,
    })
      .then((res) => {
        const updated = [...debates, res.data];
        setDebates(updated);
        setFilteredDebates(updated);
        setNewDebateId("");
        setNewDebateTitle("");
        setNewDebateDesc("");
        setNewDebateCategory("");
        setShowForm(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        alert(err.response?.data?.message || err.message);
      });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredDebates(
      debates.filter((debate) =>
        (debate.title + debate.description + debate.category)
          .toLowerCase()
          .includes(query)
      )
    );
  };

  const toggleNavbar = () => setIsNavCollapsed(!isNavCollapsed);


  return (
    <div style={{ backgroundColor: '#f7f9fc', fontFamily: 'Poppins, sans-serif', minHeight: '100vh' }}>
      
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
            <li className="nav-item mx-2"><Link className="nav-link" to="/dashboard" style={{ color: '#4a90e2', fontWeight: 500 }}>Dashboard</Link></li>
            <li className="nav-item mx-2"><Link className="nav-link" to="/profile" style={{ color: '#4a90e2', fontWeight: 500 }}>Profile</Link></li>
          </ul>
        </div>
      </nav>

      {/* Header Text */}
      <div className="text-center mt-5 mb-4">
        <h2 className="fw-semibold" style={{ color: '#2c3e50' }}>🔥 Trending Debates 🔥</h2>
        <p className="text-muted">Pick a side and make your voice heard!</p>
      </div>

      {/* Search Bar */}
      <div className="container mb-3">
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="Search debates by title, description or category..."
          value={searchQuery}
          onChange={handleSearch}
          style={{ borderRadius: '12px' }}
        />
      </div>

      {/* Toggle Form Button */}
      {isAdmin && (
        <div className="container mb-3 text-end">
         <button
  className="btn"
  style={{
    backgroundColor: '#4a90e2',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    fontWeight: 500,
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
  onClick={() => setShowForm(!showForm)}
>
  {showForm ? "Hide Form" : "➕ Create New Debate"}
</button>

        </div>
      )}

      {/* Create Debate Form */}
  {/* Create Debate Form */}
{isAdmin && showForm && (
  <div className="container mb-4">
    <div
      className="card shadow"
      style={{
        borderRadius: '16px',
        padding: '2rem',
        backgroundColor: '#ffffffcc',
        backdropFilter: 'blur(8px)',
        border: '1px solid #dee2e6',
      }}
    >
      <h4 className="fw-bold text-center mb-4" style={{ color: '#2c3e50' }}>
        Create New Public Debate
      </h4>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Debate ID"
          value={newDebateId}
          onChange={(e) => setNewDebateId(e.target.value)}
          style={{ borderRadius: '12px' }}
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Debate Title"
          value={newDebateTitle}
          onChange={(e) => setNewDebateTitle(e.target.value)}
          style={{ borderRadius: '12px' }}
        />
      </div>
      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="Debate Description"
          value={newDebateDesc}
          onChange={(e) => setNewDebateDesc(e.target.value)}
          style={{ borderRadius: '12px', resize: 'none' }}
          rows={3}
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Debate Category (e.g. Politics, Tech, Sports)"
          value={newDebateCategory}
          onChange={(e) => setNewDebateCategory(e.target.value)}
          style={{ borderRadius: '12px' }}
        />
      </div>
      <button
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
        onClick={createDebate}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#357ABD';
          e.target.style.transform = 'scale(1.03)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#4a90e2';
          e.target.style.transform = 'scale(1)';
        }}
      >
        Submit Debate
      </button>
    </div>
  </div>
)}

      {/* Debates Display */}
      <div className="container">
  <div className="row mt-3">
    {filteredDebates.map((debate) => (
      <div key={debate.id} className="col-md-4 mb-4">
        <div className="card h-100 shadow-sm border border-primary" style={{ borderRadius: '16px' }}>
          <div className="card-body d-flex flex-column justify-content-between text-center">
            <h5 className="card-title fw-bold text-dark">{debate.title}</h5>
            <p className="card-text text-muted">{debate.description}</p>
            <span className="badge bg-info mb-2">{debate.category}</span>
            <button
  className="btn mt-auto"
  style={{
    borderRadius: '50px',
    fontWeight: 500,
    color: '#4a90e2',
    border: '2px solid #4a90e2',
    backgroundColor: 'transparent',
    transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease',
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = '#357ABD'; // Your custom hover color
    e.target.style.color = '#fff';
    e.target.style.transform = 'scale(1.03)';
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = 'transparent';
    e.target.style.color = '#4a90e2';
    e.target.style.transform = 'scale(1)';
  }}
  onClick={() => navigate(`/public-debate/${debate.debateId}/discussion`)}
>
  Join Discussion
</button>

          </div>
        </div>
      </div>
    ))}
    {filteredDebates.length === 0 && (
      <div className="text-center text-muted my-4">No debates found.</div>
    )}
  </div>
</div>
    </div>
  );
};

export default PublicDebateList;