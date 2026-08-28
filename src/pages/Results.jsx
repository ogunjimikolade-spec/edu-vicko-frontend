import axios from "axios";
import { useEffect, useState } from "react";

const Result = () => {
  const [results, setResults] = useState([]);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    class: "",
    subject: "",
    term: "",
    session: "",
    score: "",
    grade: "",
  });
  const [editingId, setEditingId] = useState(null);

  // AUTO CALCULATE GRADE
  const calculateGrade = (score) => {
    score = Number(score);
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 45) return "D";
    if (score >= 40) return "E";
    return "F";
  };

  // FETCH ALL RESULTS
  const fetchResults = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/results`,
      );
      setResults(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchClasses = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/classes`,
      );
      setClasses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchResults();
      await fetchClasses();
    })();
  }, []);

  // HANDLE FORM CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newData = { ...formData, [name]: value };

    // Auto calculate grade when score changes
    if (name === "score") {
      newData.grade = calculateGrade(value);
    }

    setFormData(newData);
  };

  // SUBMIT - CREATE OR UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/results/${editingId}`,
          formData,
        );
        setEditingId(null);
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/results`,
          formData,
        );
      }
      setFormData({
        studentId: "",
        name: "",
        class: "",
        subject: "",
        term: "",
        session: "",
        score: "",
        grade: "",
      });
      fetchResults();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving result");
    }
  };

  // EDIT
  const handleEdit = (result) => {
    setFormData(result);
    setEditingId(result._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/results/${id}`);
      fetchResults();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📝 Student Result Management</h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "30px",
          padding: "20px",
          background: "purple",
          borderRadius: "8px",
        }}
      >
        <h3>{editingId ? "Update Result" : "Add New Result"}</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          <select
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
            style={{ background: "gray", padding: "10px" }}
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls.className}>
                {cls.className}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="studentId"
            placeholder="Student ID"
            value={formData.studentId}
            onChange={handleChange}
            required
            style={{ background: "gray", padding: "10px" }}
          />
          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleChange}
            style={{ background: "gray", padding: "10px" }}
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject e.g Mathematics"
            value={formData.subject}
            onChange={handleChange}
            required
            style={{ background: "gray", padding: "10px" }}
          />
          <select
            name="term"
            value={formData.term}
            onChange={handleChange}
            required
            style={{ background: "gray", padding: "10px" }}
          >
            <option value="">Select Term</option>
            <option value="First Term">First Term</option>
            <option value="Second Term">Second Term</option>
            <option value="Third Term">Third Term</option>
          </select>
          <input
            type="text"
            name="session"
            placeholder="Session e.g 2025/2026"
            value={formData.session}
            onChange={handleChange}
            required
            style={{ background: "gray", padding: "10px" }}
          />
          <input
            type="number"
            name="score"
            placeholder="Score"
            value={formData.score}
            onChange={handleChange}
            required
            style={{ background: "gray", padding: "10px" }}
          />
        </div>
        <p>
          <b>Auto Grade:</b> {formData.grade || "-"}
        </p>
        <button
          type="submit"
          style={{
            background: "blue",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            marginTop: "10px",
          }}
        >
          {editingId ? "Update" : "Save"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({
                studentId: "",
                name: "",
                class: "",
                subject: "",
                term: "",
                session: "",
                score: "",
                grade: "",
              });
            }}
            style={{
              background: "gray",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              marginLeft: "10px",
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* TABLE */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#333", color: "white" }}>
            <th style={{ padding: "10px" }}>Student ID</th>
            <th style={{ padding: "10px" }}>Name</th>
            <th style={{ padding: "10px" }}>Class</th>
            <th style={{ padding: "10px" }}>Subject</th>
            <th style={{ padding: "10px" }}>Term</th>
            <th style={{ padding: "10px" }}>Session</th>
            <th style={{ padding: "10px" }}>Score</th>
            <th style={{ padding: "10px" }}>Grade</th>
            <th style={{ padding: "10px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr
              key={result._id}
              style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}
            >
              <td style={{ padding: "10px" }}>{result.studentId}</td>
              <td style={{ padding: "10px" }}>{result.name}</td>
              <td style={{ padding: "10px" }}>{result.class}</td>
              <td style={{ padding: "10px" }}>{result.subject}</td>
              <td style={{ padding: "10px" }}>{result.term}</td>
              <td style={{ padding: "10px" }}>{result.session}</td>
              <td style={{ padding: "10px" }}>{result.score}</td>
              <td
                style={{
                  padding: "10px",
                  fontWeight: "bold",
                  color: result.grade === "F" ? "red" : "green",
                }}
              >
                {result.grade}
              </td>
              <td
                style={{
                  padding: "10px",
                  display: "flex",
                  gap: "5px",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => handleEdit(result)}
                  style={{
                    background: "blue",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(result._id)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Result;
