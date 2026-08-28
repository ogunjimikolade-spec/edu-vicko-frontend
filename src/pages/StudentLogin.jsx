import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentLogin() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/students/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      // Save student data to localStorage
      localStorage.setItem("student", JSON.stringify(data.student));

      // Redirect to dashboard
      navigate("/student/dashboard");
    } catch {
      setError("Server error. Check if backend dey run");
    }
  };

  return (
    <div className="login-container">
      <h2>Student Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
