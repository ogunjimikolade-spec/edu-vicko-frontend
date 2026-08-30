import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // track which row we dey edit
  const [editData, setEditData] = useState({});
  const [search, setSearch] = useState("");

  // FETCH STUDENTS - WITH SEARCH
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const url = search
          ? `${API_URL}/students/search?q=${search}`
          : `${API_URL}/students`;
        const res = await axios.get(url);
        setStudents(res.data);
      } catch (err) {
        console.log("Error fetching:", err);
        setStudents([]);
      }
      setLoading(false);
    };
    fetchStudents();
  }, [search]); // e go re-run anytime search change

  const handleEditClick = (student) => {
    setEditingId(student._id);
    setEditData(student); // put current data inside form
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await axios.put(`${API_URL}/students/${editingId}`, editData);
    setEditingId(null); // close edit mode
    // refresh will happen automatically because search didn't change
    // but let's refetch manually to be sure
    const res = await axios.get(`${API_URL}/students`);
    setStudents(res.data);
    alert("Updated!");
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await axios.delete(`${API_URL}/students/${id}`);
      const res = await axios.get(`${API_URL}/students`);
      setStudents(res.data);
      alert("Student Deleted");
    }
  };

  if (loading) return <p>Loading students...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Students</h1>
        <input
          type="text"
          placeholder="Search by Name or STU ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
          style={{ width: "300px" }}
        />
        <Link
          to="/registration"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Register Student
        </Link>
      </div>

      <table className=" bg: bg-purple-700 border w-full">
        <thead>
          <tr className="bg: bg-purple-900">
            <th className="border p-2">Student ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2">Class</th>
            <th className="border p-2">Parent</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center p-4">
                No students found
              </td>
            </tr>
          ) : (
            students.map((s) => (
              <tr key={s._id}>
                <td className="border p-2">
                  {editingId === s._id ? (
                    <input
                      name="studentId"
                      value={editData.studentId}
                      onChange={handleChange}
                      className="border p-1 w-full"
                    />
                  ) : (
                    s.studentId
                  )}
                </td>
                <td className="border p-2">
                  {editingId === s._id ? (
                    <input
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                      className="border p-1 w-full"
                    />
                  ) : (
                    s.name
                  )}
                </td>
                <td className="border p-2">
                  {editingId === s._id ? (
                    <input
                      name="gender"
                      value={editData.gender}
                      onChange={handleChange}
                      className="border p-1 w-full"
                    />
                  ) : (
                    s.gender
                  )}
                </td>
                <td className="border p-2">
                  {editingId === s._id ? (
                    <input
                      name="class"
                      value={editData.class}
                      onChange={handleChange}
                      className="border p-1 w-full"
                    />
                  ) : (
                    s.class
                  )}
                </td>
                <td className="border p-2">
                  {editingId === s._id ? (
                    <input
                      name="parentName"
                      value={editData.parentName}
                      onChange={handleChange}
                      className="border p-1 w-full"
                    />
                  ) : (
                    s.parentName
                  )}
                </td>
                <td className="border p-2">
                  {editingId === s._id ? (
                    <input
                      name="parentPhone"
                      value={editData.parentPhone}
                      onChange={handleChange}
                      className="border p-1 w-full"
                    />
                  ) : (
                    s.parentPhone
                  )}
                </td>
                <td className="border p-2">
                  {editingId === s._id ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(s)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(s._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Students;
