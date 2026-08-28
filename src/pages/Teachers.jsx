import { useEffect, useState } from "react";

export default function Teachers() {
  const [showModal, setShowModal] = useState(false);
  const [teachers, setTeachers] = useState([]); // NO MORE HARCODE

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
  });

  // FETCH FROM DB ON LOAD
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teachers`);
      const data = await res.json();
      setTeachers(data);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD TEACHER TO DB
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teachers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ name: "", email: "", phone: "", subject: "" });
        setShowModal(false);
        fetchTeachers(); // RELOAD FROM DB
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" p-6">
      <div className="flex justify-between items-center mb-4 ">
        <h1 className="text-2xl font-bold">Teachers</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Teacher
        </button>
      </div>

      {/* TEACHERS TABLE */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Subject</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher._id}>
              {" "}
              {/* USE _id FROM MONGODB */}
              <td className="p-2 border">{teacher.name}</td>
              <td className="p-2 border">{teacher.email}</td>
              <td className="p-2 border">{teacher.phone}</td>
              <td className="p-2 border">{teacher.subject}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD TEACHER MODAL/FORM */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-400 p-6 rounded w-96">
            <h2 className=" bg-gray-400 text-xl font-bold mb-4">Add New Teacher</h2>
            <form onSubmit={handleAddTeacher}>
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className=" bg-gray-500 w-full border p-2 mb-3 rounded"
                required
              />
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className=" bg-gray-500 w-full border p-2 mb-3 rounded"
                required
              />
              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className=" bg-gray-500 w-full border p-2 mb-3 rounded"
              />
              <input
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                className=" bg-gray-500 w-full border p-2 mb-3 rounded"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
