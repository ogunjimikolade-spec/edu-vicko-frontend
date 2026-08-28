import * as XLSX from "xlsx";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Fees = () => {
  const [fees, setFees] = useState([]);
  const totalPaid = fees.reduce((sum, f) => sum + Number(f.amountPaid), 0);
  const totalAmount = fees.reduce((sum, f) => sum + Number(f.amount), 0);
  const totalBalance = totalAmount - totalPaid;
  const [search, setSearch] = useState("");
  const [editingFee, setEditingFee] = useState(null);
  const [viewingFee, setViewingFee] = useState(null);
  const [form, setForm] = useState({
    studentId: "",
    name: "",
    class: "",
    term: "",
    type: "",
    amount: "",
    amountPaid: "",
  });

  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await axios.get(`${API_URL}/fees`);
      setFees(res.data || res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredFees = fees.filter(
    (fee) =>
      fee.studentId?.toLowerCase().includes(search.toLowerCase()) ||
      fee.name?.toLowerCase().includes(search.toLowerCase()) ||
      fee.class?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/fees/addpayment`, form);
      alert("Payment successful!");
      setForm({
        studentId: "",
        name: "",
        class: "",
        term: "",
        type: "",
        amount: "",
        amountPaid: "",
      });
      fetchFees();
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };
  const handleEdit = (fee) => {
    setEditingFee(fee);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.put(
      `${import.meta.env.VITE_API_URL}/fees/update/${editingFee._id}`,
      {
        amountPaid: editingFee.amountPaid,
      },
    );
    alert("Updated!");
    setEditingFee(null);
    fetchFees();
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delet this record?")) {
      try {
        await axios.delete(`${API_URL}/fees/${id}`);
        alert("Deleted!");
        fetchFees();
      } catch (err) {
        alert("Error: " + err.message);
      }
    }
  };
  const handlePrint = (fee) => {
    const printWindow = window.open("", "", "height=600,width=400");
    printWindow.document.write(`
    <html>
      <head><title>Receipt</title></head>
      <body style="font-family: Arial; padding: 20px;">
        <h2 style="text-align:center">SCHOOL FEE RECEIPT</h2>
        <hr/>
        <p><b>Student ID:</b> ${fee.studentId}</p>
        <p><b>Name:</b> ${fee.studentName}</p>
        <p><b>Class:</b> ${fee.class}</p>
        <p><b>Term:</b> ${fee.term}</p>
        <hr/>
        <p><b>Total Amount:</b> ₦${fee.amount.toLocaleString()}</p>
        <p><b>Amount Paid:</b> ₦${fee.amountPaid.toLocaleString()}</p>
        <p><b>Balance:</b> ₦${fee.balance.toLocaleString()}</p>
        <p><b>Status:</b> ${fee.status}</p>
        <hr/>
        <p style="text-align:center">Thank you!</p>
        <script>window.print();</script>
      </body>
    </html>
  `);
    printWindow.document.close();
  };
  const handleExport = () => {
    const data = fees.map((f) => ({
      "Student ID": f.studentId,
      Name: f.studentName,
      Class: f.class,
      Term: f.term,
      "Total Amount": f.amount,
      "Amount Paid": f.amountPaid,
      Balance: f.balance,
      Status: f.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fee Records");
    XLSX.writeFile(wb, `Fee_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleView = (fee) => {
    setViewingFee(fee);
  };
const handleWhatsApp = (fee) => {
  const message = `Hello ${fee.studentName} Parent,%0A%0A*SCHOOL FEE RECEIPT*%0A%0AStudent ID: ${fee.studentId}%0AClass: ${fee.class}%0ATerm: ${fee.term}%0A%0ATotal Amount: ₦${fee.amount.toLocaleString()}%0AAmount Paid: ₦${fee.amountPaid.toLocaleString()}%0ABalance: ₦${fee.balance.toLocaleString()}%0AStatus: ${fee.status}%0A%0AThank you!`;

  // Replace with parent's number. For now we just open WhatsApp
  const url = `https://wa.me/?text=${message}`;
  window.open(url, "_blank");
};


  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>Fee Management</h2>

      <input
        type="text"
        placeholder="Search by StudentID, Name, or Class..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginBottom: "20px",
          padding: "8px",
          width: "300px",
          background: "gray",
        }}
      />

      <div
        style={{
          marginBottom: "30px",
          border: "1px solid #555",
          padding: "15px",
          borderRadius: "5px",
        }}
      >
        <h3>Add Payment</h3>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "10px",
            }}
          >
            <input
              name="studentId"
              placeholder="Student ID"
              style={{ backgroundColor: "lightblue", padding: "10px" }}
              value={form.studentId}
              onChange={handleChange}
              required
            />
            <input
              name="name"
              placeholder="Student Name"
              style={{ backgroundColor: "lightblue", padding: "10px" }}
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="class"
              placeholder="Class"
              style={{ backgroundColor: "lightblue", padding: "10px" }}
              value={form.class}
              onChange={handleChange}
              required
            />
            <input
              name="term"
              placeholder="Term"
              style={{ backgroundColor: "lightblue", padding: "10px" }}
              value={form.term}
              onChange={handleChange}
              required
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "10px",
            }}
          >
            <input
              name="type"
              placeholder="Fee Type"
              style={{ backgroundColor: "lightblue", padding: "10px" }}
              value={form.type}
              onChange={handleChange}
              required
            />
            <input
              name="amount"
              type="number"
              placeholder="Amount"
              style={{ backgroundColor: "lightblue", padding: "10px" }}
              value={form.amount}
              onChange={handleChange}
              required
            />
            <input
              name="amountPaid"
              type="number"
              placeholder="Amount Paid"
              style={{ backgroundColor: "lightblue", padding: "10px" }}
              value={form.amountPaid}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            style={{ backgroundColor: "green", padding: "10px" }}
          >
            Add Payment
          </button>
        </form>
      </div>

      <div>
        <h3>Payment Records</h3>
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <div
            style={{
              padding: "15px",
              background: "#74a378",
              borderRadius: "8px",
            }}
          >
            <h4>Total Paid</h4>
            <h2 style={{ color: "green" }}>₦{totalPaid.toLocaleString()}</h2>
          </div>
          <div
            style={{
              padding: "15px",
              background: "#0dad3d",
              borderRadius: "8px",
            }}
          >
            <h4>Total Amount</h4>
            <h2>₦{totalAmount.toLocaleString()}</h2>
          </div>
          <div
            style={{
              padding: "15px",
              background: "#550f03",
              borderRadius: "8px",
            }}
          >
            <h4>Total Balance</h4>
            <h2 style={{ color: "red" }}>₦{totalBalance.toLocaleString()}</h2>
          </div>
          <button
            onClick={handleExport}
            style={{
              background: "purple",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            Export to Excel
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                StudentID
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Class
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Term</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Amount
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Paid</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Balance
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Status
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredFees.map((fee) => (
              <tr key={fee._id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {fee.studentId}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {fee.name}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {fee.class}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {fee.term}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {fee.amount}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {fee.amountPaid}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {fee.balance}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {fee.status}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  <button
                    onClick={() => handleEdit(fee)}
                    style={{ background: "blue" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(fee._id)}
                    style={{ background: "red" }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handlePrint(fee)}
                    style={{ background: "green" }}
                  >
                    Print
                  </button>
                  <button
                    onClick={() => handleWhatsApp(fee)}
                    style={{ background: "darkblue" }}
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => handleView(fee)}
                    style={{ background: "purple" }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingFee && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#333",
            padding: "20px",
            zIndex: 10,
          }}
        >
          <h3>Edit Payment for {editingFee.name}</h3>
          <form onSubmit={handleUpdate}>
            <input
              style={{ background: "gray" }}
              type="number"
              value={editingFee.amountPaid}
              onChange={(e) =>
                setEditingFee({ ...editingFee, amountPaid: e.target.value })
              }
            />
            <button
              type="submit"
              style={{ backgroundColor: "green", padding: "5px" }}
            >
              Save
            </button>
            <button
              type="button"
              style={{ backgroundColor: "red", padding: "5px" }}
              onClick={() => setEditingFee(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {viewingFee && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              width: "400px",
              color: "black",
            }}
          >
            <h3>Payment Details</h3>
            <p>
              <b>Student:</b> {viewingFee.studentName}
            </p>
            <p>
              <b>ID:</b> {viewingFee.studentId}
            </p>
            <p>
              <b>Class:</b> {viewingFee.class}
            </p>
            <p>
              <b>Term:</b> {viewingFee.term}
            </p>
            <p>
              <b>Amount:</b> ₦{viewingFee.amount.toLocaleString()}
            </p>
            <p>
              <b>Paid:</b> ₦{viewingFee.amountPaid.toLocaleString()}
            </p>
            <p>
              <b>Balance:</b> ₦{viewingFee.balance.toLocaleString()}
            </p>
            <p>
              <b>Status:</b> {viewingFee.status}
            </p>
            <button
              onClick={() => setViewingFee(null)}
              style={{ marginTop: "15px", background: "red", color: "white" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fees;
