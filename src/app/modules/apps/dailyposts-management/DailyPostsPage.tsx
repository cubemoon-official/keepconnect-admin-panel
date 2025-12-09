import { useState } from "react";

const DailyPosts = () => {
    const [imagePreview, setImagePreview] = useState(null);

    const mockPosts = [
        {
            id: 1,
            title: "Diwali Offer",
            image: "/uploads/post1.jpg",
            created_at: "2025-12-01",
        },
        {
            id: 2,
            title: "Christmas Sale",
            image: "/uploads/post2.jpg",
            created_at: "2025-12-05",
        }
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="p-5">

            {/* Top Title */}
            <h2 className="fw-bold fs-2 mb-5 text-danger">Daily Posts</h2>

            {/* Upload Card */}
            <div className="card p-4 mb-5 shadow-sm" style={{ borderRadius: 12 }}>
                <h5 className="fw-bold mb-3">Upload Daily Post</h5>

                <div className="row g-3">

                    {/* File Upload */}
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">Upload Image</label>
                        <input 
                            type="file" 
                            className="form-control" 
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {imagePreview && (
                            <img 
                                src={imagePreview}
                                alt="Preview"
                                className="mt-3 rounded"
                                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                            />
                        )}
                    </div>

                    {/* Title */}
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">Post Title</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Enter post title"
                        />
                    </div>

                    {/* Description */}
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">Description</label>
                        <textarea 
                            className="form-control"
                            rows="1"
                            placeholder="Write something..."
                        ></textarea>
                    </div>

                </div>

                <button className="btn btn-danger mt-4 px-4 py-2">Upload Post</button>
            </div>

            {/* Table */}
            <div className="card p-4 shadow-sm" style={{ borderRadius: 12 }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold m-0">Daily Posts List</h5>

                    <input 
                        className="form-control w-25" 
                        placeholder="Search post..."
                    />
                </div>

                <table className="table align-middle">
                    <thead>
                        <tr>
                            <th>IMAGE</th>
                            <th>TITLE</th>
                            <th>DATE</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {mockPosts.map((post) => (
                            <tr key={post.id}>
                                <td>
                                    <img 
                                        src={post.image}
                                        alt=""
                                        width="60"
                                        height="60"
                                        className="rounded"
                                        style={{ objectFit: "cover" }}
                                    />
                                </td>
                                <td className="fw-semibold">{post.title}</td>
                                <td>{post.created_at}</td>
                                <td>
                                    <button className="btn btn-sm btn-light-danger me-2">Delete</button>
                                    <button className="btn btn-sm btn-light-primary">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default DailyPosts;
