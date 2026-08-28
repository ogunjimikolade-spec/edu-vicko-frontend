import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [results, setResults] = useState([]);
  const student = JSON.parse(localStorage.getItem("student"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!student) {
      navigate("/student/login"); // redirect if not logged in
      return;
    }

    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/result?studentId=${student.studentId}`,
      )
      .then((res) => setResults(res.data))
      .catch((err) => console.log(err));
  }, [student, navigate]);

  if (!student) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome, {student.name}</h2>

      <h3>Fee Balance</h3>
      <p>Amount Paid: ₦{student.amountPaid || 0}</p>
      <p>Balance: ₦{student.balance || 0}</p>

      <h3>My Results</h3>
      {results && results.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {results.map((s, index) => (
              <tr key={index}>
                <td>{s.subject}</td>
                <td>{s.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results uploaded yet</p>
      )}
    </div>
  );
}
export default StudentDashboard;
