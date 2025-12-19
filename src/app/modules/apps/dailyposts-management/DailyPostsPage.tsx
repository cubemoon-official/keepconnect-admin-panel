import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const API_BASE = `${import.meta.env.VITE_APP_API_URL}/api/media`;


const DailyPosts = () => {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState("poster"); // default type
  const [title, setTitle] = useState("");

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [viewPost, setViewPost] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH POSTS ----------------
  const fetchPosts = async () => {
    try {
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("API response:", res.data);

      // Combine both poster and video collections
      const postsArray = [
        ...(res.data.poster || []),
        ...(res.data.video || []),
      ];

      setPosts(postsArray);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ---------------- FILE PREVIEW ----------------
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));

    // Determine type automatically
    if (selectedFile.type.startsWith("image/")) setFileType("poster");
    else if (selectedFile.type.startsWith("video/")) setFileType("video");
  };

  // ---------------- UPLOAD ----------------
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("collection", fileType);
      formData.append("title", title);

      const res = await axios.post(`${API_BASE}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Upload response:", res.data);

      // Refresh posts
      fetchPosts();

      // Reset form
      setFile(null);
      setFilePreview(null);
      setTitle("");
      setFileType("poster");
    } catch (err) {
      console.error("Upload error:", err);
    }

    setLoading(false);
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Remove from state
      setPosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ---------------- FILTER POSTS ----------------
  const filteredPosts = posts.filter((post) =>
    (post.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 mt-20">
      <div className='d-flex align-items-center justify-content-start mb-10'>
        <h1
          className='fw-bold mt-10'
          style={{ fontSize: '1.3rem', color: '#fff', marginLeft: '16%' }}
        >
          Daily Post Management
        </h1>
      </div>
      {/* Upload Card */}
      <div className="card p-4 py-5 mb-8 shadow-sm" style={{ maxWidth: '68%', marginLeft: '16%' }}>
        <h5 className="fw-bold mb-3">Upload Daily Post</h5>

        <div className="row g-4">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Select File (Image/Video)</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
            />
            {filePreview && (
              <div className="mt-3">
                {fileType === "poster" ? (
                  <img
                    src={filePreview}
                    alt="preview"
                    width="120"
                    height="120"
                    className="rounded shadow-sm"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <video
                    src={filePreview}
                    width="180"
                    height="120"
                    controls
                    className="rounded shadow-sm"
                  />
                )}
              </div>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Post Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <button
          className="btn btn-danger mt-4 px-4 py-2"
          onClick={handleUpload}
          style={{ backgroundColor: "#df5757ff" }}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Post"}
        </button>
      </div>

      {/* Posts Table */}
      <div className="card p-4 shadow-sm" style={{ maxWidth: '68%', marginLeft: '16%' }}>
        <div className="d-flex justify-content-between mb-3">
          <h5 className="fw-bold">Daily Posts List</h5>
          <input
            className="form-control"
            style={{ width: "230px" }}
            placeholder="Search by name..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>PREVIEW</th>
              <th>NAME</th>
              <th>TYPE</th>
              <th className="text-center">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {filteredPosts.map((post, index) => {
              console.log("Rendering post:", post); // ✅ debug
              return (
                <tr key={post.id || index}>
                  <td>
                    {post.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img
                        src={post.url}
                        width="60"
                        height="60"
                        style={{ objectFit: "cover" }}
                        className="rounded shadow-sm"
                        alt={post.name}
                      />
                    ) : (
                      <video
                        src={post.url}
                        width="120"
                        height="60"
                        controls
                        className="rounded shadow-sm"
                      />
                    )}
                  </td>
                  <td>{post.name || "-"}</td>
                  <td>{post.type || "-"}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-danger me-2"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setViewPost(post)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      <Modal show={!!viewPost} onHide={() => setViewPost(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Post Details</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          {viewPost && (
            <>
              {viewPost.type.startsWith("image") ? (
                <img
                  src={viewPost.url}
                  width="200"
                  height="200"
                  style={{ objectFit: "cover" }}
                  className="rounded mb-3"
                  alt={viewPost.name}
                />
              ) : (
                <video
                  src={viewPost.url}
                  width="300"
                  height="200"
                  controls
                  className="rounded mb-3"
                />
              )}
              <h5>{viewPost.name || "-"}</h5>
              <p>{viewPost.type || "-"}</p>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewPost(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DailyPosts;
