import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
          `https://eduvicko-backend.onrender.com/api/auth/login`,
        {
          email,
          password,
        },
        {withCredentials: true}
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user",JSON.stringify(res.data.name));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200')",
        backgroundSize: "cover",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          width: "350px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          🏫 School Admin Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            background: "gray",
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            background: "gray",
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#1890ff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        >
          Login
        </button>
        {/* <p className="text-red-950">Don't have an account?    <Link to="/register" className="bg-green-600 text-gray-600">Register</Link></p> */}
      </form>
    </div>
  );
};

export default Login;
