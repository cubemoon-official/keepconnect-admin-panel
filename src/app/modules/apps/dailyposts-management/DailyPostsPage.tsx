import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [type, setType] = useState(""); // image | video
  const [language, setLanguage] = useState("");
  const [date, setDate] = useState("");

  const fileInputRef = useRef(null); // 🔹 Ref to reset file input

  /* 🔹 PAGINATION STATE */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ---------------- FETCH POSTS ----------------
  const fetchPosts = async () => {
    try {
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

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

    const isImage = selectedFile.type.startsWith("image/");
    const isVideo = selectedFile.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Only image or video files are allowed");
      clearFile();
      return;
    }

    if (isImage && selectedFile.size > 1 * 1024 * 1024) {
      toast.error("Image size must be 1 MB or less");
      clearFile();
      return;
    }

    if (isVideo && selectedFile.size > 10 * 1024 * 1024) {
      toast.error("Video size must be 10 MB or less");
      clearFile();
      return;
    }

    // Clear old preview to prevent memory leaks
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
    setType(isImage ? "image" : "video");
    setFileType(isImage ? "poster" : "video");

    toast.success("File selected successfully ✅");
  };

  // ---------------- CLEAR FILE ----------------
  const clearFile = () => {
    setFile(null);
    setType("");
    setFileType("poster");
    setTitle("");
    setLanguage("");
    setDate("");

    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }

    // Reset the actual file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ---------------- UPLOAD ----------------
  const handleUpload = async () => {
    if (!file) {
      toast.warning("Please select a file first ⚠️");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("collection", fileType);
      formData.append("title", title);
      formData.append("language", language);
      formData.append("date", date);

      await axios.post(`${API_BASE}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Post uploaded successfully 🎉");
      fetchPosts();
      clearFile();
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed. Please try again ❌");
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

      setPosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ---------------- FILTER POSTS ----------------
  const filteredPosts = posts.filter((post) =>
    (post.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="p-4 mt-20">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      <div className="d-flex align-items-center justify-content-start mb-10">
        <h1
          className="fw-bold mt-10"
          style={{ fontSize: "1.3rem", color: "#fff", marginLeft: "16%" }}
        >
          Daily Post Management
        </h1>
      </div>

      {/* Upload Card */}
      <div
        className="card p-4 py-5 mb-8 shadow-sm"
        style={{ maxWidth: "68%", marginLeft: "16%" }}
      >
        <h5 className="fw-bold mb-3">Upload Daily Post</h5>

        <div className="row g-4">
          {/* FILE */}
          <div className="col-md-4">
            <label className="form-label fw-semibold">
              Select File (Image / Video)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              className="form-control"
              onChange={handleFileChange}
            />

            {filePreview && (
              <div className="mt-3">
                {type === "image" ? (
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

          {/* TYPE */}
          <div className="col-md-4">
            <label className="form-label fw-semibold">Post Type</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setFileType(e.target.value === "image" ? "poster" : "video");
              }}
            >
              <option value="">Select type</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          {/* LANGUAGE */}
          <div className="col-md-4">
            <label className="form-label fw-semibold">Language</label>
            <select
              className="form-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Marathi">Marathi</option>
            </select>
          </div>

          {/* TITLE */}
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

          {/* DATE */}
          <div className="col-md-4">
            <label className="form-label fw-semibold">Post Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: "68%", marginLeft: "16%" }}
      >
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
              <th>TITLE</th>
              <th>TYPE</th>
              <th>THUMBNAIL</th>
              <th>DURATION</th>
              <th>LANGUAGE</th>
              <th>DATE</th> {/* Use created_at */}
              <th className="text-center">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {paginatedPosts.map((post, index) => (
              <tr key={post.id || index}>
                <td>
                  {post.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img
                      src={post.url}
                      width="60"
                      height="60"
                      className="rounded"
                    />
                  ) : (
                    <video src={post.url} width="120" height="60" controls />
                  )}
                </td>
                <td>{post.title || "-"}</td>
                <td>{post.type || "-"}</td>
                <td>
                  {post.thumbnail ? (
                    <img src={post.thumbnail} width="60" />
                  ) : (
                    "-"
                  )}
                </td>
                <td>{post.duration ? `${post.duration} sec` : "-"}</td>
                <td>{post.language || "-"}</td>
                <td>
                  {post.created_at
                    ? (() => {
                        const dateString = post.created_at; // or post.createdAt
                        const date = new Date(dateString);

                        if (isNaN(date.getTime())) return "-"; // invalid date fallback

                        const day = String(date.getDate()).padStart(2, "0");
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const year = date.getFullYear();

                        return `${day}/${month}/${year}`;
                      })()
                    : "-"}
                </td>

                {/* Format created_at */}
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
            ))}
          </tbody>
        </table>

        {/* 🔹 PAGINATION UI */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-end mt-3">
            <ul className="pagination mb-0">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Prev
                </button>
              </li>

              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
        )}
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
