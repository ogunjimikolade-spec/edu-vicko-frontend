import axios from "axios";
import { useEffect, useState } from "react";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    className: "",
    classTeacher: "",
    arm: "",
    studentCount: "",
  });
  const [editingId, setEditingId] = useState(null);

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
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/classes/${editingId}`,
          formData,
        );
        setEditingId(null);
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/classes`,
          formData,
        );
      }
      setFormData({
        className: "",
        classTeacher: "",
        arm: "",
        studentCount: "",
      });
      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving class");
    }
  };

  const handleEdit = (cls) => {
    setFormData(cls);
    setEditingId(cls._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this class?")) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/classes/${id}`);
      fetchClasses();
    }
  };

  return (
    <div style={{display: "grid", mid: "grid-col-2", padding: "20px" }}>
      <h2>🏫 Class Management</h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "30px",
          padding: "20px",
          background: "skyblue",
          borderRadius: "8px",
        }}
      >
        <h3>{editingId ? "Update Class" : "Add New Class"}</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          <input
            type="text"
            name="className"
            placeholder="Class Name e.g JSS1A"
            value={formData.className}
            onChange={handleChange}
            required
            style={{ background: "lightgray", padding: "10px" }}
          />
          <input
            type="text"
            name="classTeacher"
            placeholder="Class Teacher Name"
            value={formData.classTeacher}
            onChange={handleChange}
            style={{ background: "lightgray", padding: "10px" }}
          />
          <input
            type="text"
            name="arm"
            placeholder="Arm e.g A, B, C"
            value={formData.arm}
            onChange={handleChange}
            style={{ background: "lightgray", padding: "10px" }}
          />
          <input
            type="number"
            name="studentCount"
            placeholder="No of Students"
            value={formData.studentCount}
            onChange={handleChange}
            style={{ background: "lightgray", padding: "10px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            background: "#1890ff",
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
                className: "",
                classTeacher: "",
                arm: "",
                studentCount: "",
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
          <tr style={{ background: "#1890ff", color: "white" }}>
            <th style={{ padding: "10px" }}>Class Name</th>
            <th style={{ padding: "10px" }}>Class Teacher</th>
            <th style={{ padding: "10px" }}>Arm</th>
            <th style={{ padding: "10px" }}>Students</th>
            <th style={{ padding: "10px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr
              key={cls._id}
              style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}
            >
              <td style={{ padding: "10px", fontWeight: "bold" }}>
                {cls.className}
              </td>
              <td style={{ padding: "10px" }}>{cls.classTeacher}</td>
              <td style={{ padding: "10px" }}>{cls.arm}</td>
              <td style={{ padding: "10px" }}>{cls.studentCount}</td>
              <td
                style={{
                  padding: "10px",
                  display: "flex",
                  gap: "5px",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => handleEdit(cls)}
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
                  onClick={() => handleDelete(cls._id)}
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

export default Classes;
