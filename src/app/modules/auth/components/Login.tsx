import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useAuth } from "../core/Auth";
import { login } from "../core/_requests";  // 👈 imported

export default function SimpleLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { saveAuth } = useAuth();
  // const navigate = useNavigate();

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔥 calling login() from _requests.ts
      const response = await login(email, password);

      if (response.data?.token) {

    // 🔥 Token ko localStorage me store karo
    localStorage.setItem("token", response.data.token);

    // Auth context
    saveAuth({
      token: response.data.token,
    });

    alert("Login Success!");
    window.location.href = "/KeepConnect/dashboard";
} else {
    setError("Invalid login response");
}
    } catch (err) {
      console.log(err);
      setError("Wrong email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-100 d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <form
        onSubmit={handleLogin}
        style={{ width: "350px" }}
        className="border p-4 rounded shadow"
      >
        <h2 className="text-center mb-4">Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          className="btn btn-primary w-100"
          type="submit"
          disabled={loading}
        >
          {loading ? "Please wait..." : "Login"}
        </button>
      </form>
    </div>
  );
}