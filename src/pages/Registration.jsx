import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

function Registration() {
  const [formData, setFormData] = useState({
    studentId: "",
    password: "",
    name: "",
    gender: "",
    dob: "",
    class: "",
    parentName: "",
    parentPhone: "",
    address: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/students`, formData);
      alert("Student Registered Successfully!");
      navigate("/students");
    } catch (err) {
      alert("Registration failed: " + err.response.data.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Student Registration</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
       
          <input className="bg-slate-300"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input className="bg-slate-300" name="gender" placeholder="Gender" onChange={handleChange} />
        <input className="bg-slate-300" name="dob" type="date" onChange={handleChange} />
        <input className="bg-slate-300"
          name="class"
          placeholder="Class e.g pry 5"
          onChange={handleChange}
        />
        <input className="bg-slate-300"
          name="parentName"
          placeholder="Parent Name"
          onChange={handleChange}
        />
        <input className="bg-slate-300"
          name="parentPhone"
          placeholder="Parent Phone"
          onChange={handleChange}
        />
        <input className="bg-slate-300" name="address" placeholder="Address" onChange={handleChange} />
        <button className="bg-blue-500 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}

export default Registration;
