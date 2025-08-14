import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import userProfile from "../UserProfile";
import useEmail from "../getEmail";
import logo from "../../assets/logo.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import apiClient from "../../apiClient"; // ✅ Added apiClient

const DebateDiscussion = () => {
  const { debateId } = useParams();
  const [debateInfo, setDebateInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [userSide, setUserSide] = useState("");
  const [newPost, setNewPost] = useState("");
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const toggleNavbar = () => setIsNavCollapsed(!isNavCollapsed);
  const username = userProfile();
  const email = useEmail();

  useEffect(() => {
    apiClient.get(`/public-debates/${debateId}`)
      .then((res) => setDebateInfo(res.data))
      .catch((err) => console.error("Error fetching debate info:", err));
  }, [debateId]);

  useEffect(() => {
    apiClient.get(`/posts/${debateId}`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, [debateId]);

  const submitPost = () => {
    if (!newPost.trim() || !userSide) return;

    apiClient.post("/posts", {
      content: newPost,
      side: userSide,
      debateId,
      author: username,
      authorUserName: email,
    })
      .then((res) => {
        setPosts((prev) => [...prev, res.data]);
        setNewPost("");
      })
      .catch((err) => {
        console.error("Error submitting post:", err);
        alert(err.response?.data?.message || err.message);
      });
  };

  const vote = async (postId, direction) => {
    try {
      const res = await apiClient.post(`/posts/${postId}/vote?direction=${direction}`);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, votes: p.votes + (direction === "up" ? 1 : -1) }
            : p
        )
      );
    } catch (err) {
      console.error("Error voting:", err);
      alert(err.response?.data?.message || "Something went wrong while voting.");
    }
  };

  const deletePost = async (postId) => {
    try {
      await apiClient.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error("Error deleting:", err);
      alert(err.response?.data?.message || "Something went wrong while deleting.");
    }
  };

  const postsBySide = (side) => posts.filter((p) => p.side === side);


  return (
    <div style={{
      backgroundColor: "#f7f9fc",
      minHeight: "100vh",
      width: "100vw",
      fontFamily: "'Poppins', sans-serif",
      margin: 0,
      padding: 0,
      overflowX: "hidden"
    }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg px-4 shadow-sm" style={{ backgroundColor: '#ffffff', borderBottom: '2px solid #4a90e2' }}>
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2" style={{ textDecoration: 'none' }}>
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

      {/* Main Content */}
      <div className="px-4 py-4">
        {debateInfo && (
          <div className="mb-4 text-center">
            <h3 className="fw-bold text-dark">{debateInfo.title}</h3>
            <p className="text-muted">{debateInfo.description}</p>
            <span className="px-3 py-1 rounded-pill text-white" style={{ backgroundColor: "#4a90e2", fontSize: "0.9rem" }}>
              {debateInfo.category}
            </span>
          </div>
        )}

        {!userSide && (
          <div className="text-center mt-4">
            <h5 className="fw-semibold">Choose your side</h5>
            {["FOR", "AGAINST"].map((side) => (
              <button
                key={side}
                className="btn mx-2"
                style={{
                  backgroundColor: "#4a90e2",
                  color: "#fff",
                  borderRadius: "30px",
                  fontWeight: "500",
                  padding: "0.5rem 1.2rem",
                  boxShadow: "0 2px 6px rgba(74,144,226,0.2)",
                }}
                onClick={() => setUserSide(side)}
              >
                {side}
              </button>
            ))}
          </div>
        )}

        {userSide && (
          <>
            <div className="mb-4 px-2">
              <textarea
                className="form-control mb-2"
                placeholder="Share your thoughts..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                style={{ borderRadius: "12px" }}
              />
              <button
                className="btn"
                onClick={submitPost}
                style={{
                  backgroundColor: "#4a90e2",
                  color: "#fff",
                  borderRadius: "30px",
                  fontWeight: "500",
                  padding: "0.4rem 1rem",
                }}
              >
                Submit
              </button>
            </div>

            <div className="row">
              {["FOR", "AGAINST"].map((side) => (
                <div key={side} className="col-md-6 mb-4">
                  <div className="p-3 shadow-sm bg-white rounded" style={{ border: "1px solid #dee2e6" }}>
                    <h5 className="text-center text-primary fw-semibold mb-3">{side}</h5>
                    {postsBySide(side).map((post) => (
                      <div key={post.id} className="card mb-3" style={{ borderRadius: "12px" }}>
                        <div className="card-body">
                          <div className="d-flex justify-content-between mb-2">
                            <strong>{post.author || "Anonymous"}</strong>
                            <small className="text-muted">
                              {new Date(post.createdAt || Date.now()).toLocaleString()}
                            </small>
                          </div>
                                                   <p>{post.content}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              Votes: {post.votes}
                            </small>
                            <div>
                              <button
                                className="btn btn-sm btn-outline-primary me-1"
                                onClick={() => vote(post.id, "up")}
                              >
                                ⬆️
                              </button>
                              <button
                                className="btn btn-sm btn-outline-primary me-1"
                                onClick={() => vote(post.id, "down")}
                              >
                                ⬇️
                              </button>
                              {/* {(post.author === username || username === "ADMIN") && ( */}
                                <button
                                  className="btn btn-sm btn-outline-dark"
                                  onClick={() => deletePost(post.id)}
                                >
                                  🗑️ Delete
                                </button>
                              {/* )} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {postsBySide(side).length === 0 && (
                      <p className="text-muted text-center">No posts yet.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DebateDiscussion;