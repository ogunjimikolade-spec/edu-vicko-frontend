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
      await axios.post(`${API_URL}/fees/addpayment`, form);
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
    await axios.put(`${API_URL}/fees/update/${editingFee._id}`, {
      amountPaid: editingFee.amountPaid,
    });
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
    const url = `https://wa.me/?text=${message}`;
    window.open(url, "_blank");
  };

  return (
    <div className="p-4 md:p-5 text-white">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Fee Management</h2>

      <input
        type="text"
        placeholder="Search by StudentID, Name, or Class..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-[300px] mb-5 p-2 bg-gray-500 rounded text-white placeholder-gray-300 focus:outline-none"
      />

      <div className="mb-8 border-[#555] p-4 rounded-md">
        <h3 className="text-xl font-bold mb-3">Add Payment</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <input
              name="studentId"
              placeholder="Student ID"
              className="bg-sky-200 text-black p-2.5 rounded w-full"
              value={form.studentId}
              onChange={handleChange}
              required
            />
            <input
              name="name"
              placeholder="Student Name"
              className="bg-sky-200 text-black p-2.5 rounded w-full"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="class"
              placeholder="Class"
              className="bg-sky-200 text-black p-2.5 rounded w-full"
              value={form.class}
              onChange={handleChange}
              required
            />
            <input
              name="term"
              placeholder="Term"
              className="bg-sky-200 text-black p-2.5 rounded w-full"
              value={form.term}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <input
              name="type"
              placeholder="Fee Type"
              className="bg-sky-200 text-black p-2.5 rounded w-full"
              value={form.type}
              onChange={handleChange}
              required
            />
            <input
              name="amount"
              type="number"
              placeholder="Amount"
              className="bg-sky-200 text-black p-2.5 rounded w-full"
              value={form.amount}
              onChange={handleChange}
              required
            />
            <input
              name="amountPaid"
              type="number"
              placeholder="Amount Paid"
              className="bg-sky-200 text-black p-2.5 rounded w-full"
              value={form.amountPaid}
              onChange={handleChange}
            />
            <input
              name="Parent Phone"
              type="number"
              placeholder="Parent Phone"
              className="bg-sky-200 text-black p-2.5 rounded w-full"
              value={form.parentNumber}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-4 py-2.5 rounded font-semibold"
          >
            Add Payment
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Payment Records</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="p-4 bg-[#74a378] rounded-lg">
            <h4>Total Paid</h4>
            <h2 className="text-2xl font-bold text-green-900">
              ₦{totalPaid.toLocaleString()}
            </h2>
          </div>
          <div className="p-4 bg-[#0dad3d] rounded-lg">
            <h4>Total Amount</h4>
            <h2 className="text-2xl font-bold">
              ₦{totalAmount.toLocaleString()}
            </h2>
          </div>
          <div className="p-4 bg-[#550f03] rounded-lg">
            <h4>Total Balance</h4>
            <h2 className="text-2xl font-bold text-red-400">
              ₦{totalBalance.toLocaleString()}
            </h2>
          </div>
          <button
            onClick={handleExport}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2.5 rounded font-semibold"
          >
            Export to Excel
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-[#ddd] p-2 text-left whitespace-nowrap">
                  StudentID
                </th>
                <th className="border border-[#ddd] p-2 text-left whitespace-nowrap">
                  Name
                </th>
                <th className="border border-[#ddd] p-2 text-left whitespace-nowrap">
                  Class
                </th>
                <th className="border border-[#ddd] p-2 text-left whitespace-nowrap">
                  Term
                </th>
                <th className="border border-[#ddd] p-2 text-left whitespace-nowrap">
                  Amount
                </th>
                <th className="border border-[#ddd] p-2 text-left whitespace-nowrap">
                  Paid
                </th>
                <th className="border border-[#ddd] p-2 text-left whitespace-nowrap">
                  Balance
                </th>
                <th className="border border-[#ddd] p-2 text-left whitespace-nowrap">
                  Status
                </th>
                <th className="border border-[#ddd] p-2 text-left whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFees.map((fee) => (
                <tr key={fee._id}>
                  <td className="border border-[#ddd] p-2 whitespace-nowrap">
                    {fee.studentId}
                  </td>
                  <td className="border border-[#ddd] p-2 whitespace-nowrap">
                    {fee.name}
                  </td>
                  <td className="border border-[#ddd] p-2 whitespace-nowrap">
                    {fee.class}
                  </td>
                  <td className="border border-[#ddd] p-2 whitespace-nowrap">
                    {fee.term}
                  </td>
                  <td className="border border-[#ddd] p-2 whitespace-nowrap">
                    {fee.amount}
                  </td>
                  <td className="border border-[#ddd] p-2 whitespace-nowrap">
                    {fee.amountPaid}
                  </td>
                  <td className="border border-[#ddd] p-2 whitespace-nowrap">
                    {fee.balance}
                  </td>
                  <td className="border border-[#ddd] p-2 whitespace-nowrap">
                    {fee.status}
                  </td>
                  <td className="border border-[#ddd] p-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(fee)}
                        className="bg-blue-600 px-2 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(fee._id)}
                        className="bg-red-600 px-2 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handlePrint(fee)}
                        className="bg-green-600 px-2 py-1 rounded text-xs"
                      >
                        Print
                      </button>
                      <button
                        onClick={() => handleWhatsApp(fee)}
                        className="bg-indigo-800 px-2 py-1 rounded text-xs"
                      >
                        WhatsApp
                      </button>
                      <button
                        onClick={() => handleView(fee)}
                        className="bg-purple-600 px-2 py-1 rounded text-xs"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingFee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-[#333] p-5 rounded w-full max-w-md">
            <h3 className="text-xl font-bold mb-3">
              Edit Payment for {editingFee.name}
            </h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                className="bg-gray-500 w-full p-2 rounded"
                type="number"
                value={editingFee.amountPaid}
                onChange={(e) =>
                  setEditingFee({ ...editingFee, amountPaid: e.target.value })
                }
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 px-4 py-1.5 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-red-600 px-4 py-1.5 rounded"
                  onClick={() => setEditingFee(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingFee && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          onClick={() => setViewingFee(null)}
        >
          <div
            className="bg-white p-6 rounded-lg w-full max-w-md text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-3">Payment Details</h3>
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
            <p>
              <b>Date:</b>{" "}
              {viewingFee.date
                ? new Date(viewingFee.date).toLocaleDateString("en-NG", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
            <p>
              <b>Time:</b>{" "}
              {viewingFee.date
                ? new Date(viewingFee.date).toLocaleTimeString("en-NG")
                : "N/A"}
            </p>
            <button
              onClick={() => setViewingFee(null)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
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
