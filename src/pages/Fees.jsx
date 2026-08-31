import * as XLSX from "xlsx";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Fees = () => {
  const [fees, setFees] = useState([]);
  const totalPaid = fees.reduce((sum, f) => sum + Number(f.amountPaid || 0), 0);
  const totalAmount = fees.reduce((sum, f) => sum + Number(f.amount || 0), 0);
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
    parentNumber: "",
  });

  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await axios.get(`${API_URL}/fees`);
      setFees(res.data || []);
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
        parentNumber: "",
      });
      fetchFees();
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  const handleEdit = (fee) => setEditingFee(fee);
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
    if (window.confirm("Are you sure you want to delete this record?")) {
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
    <html><head><title>Receipt</title></head>
      <body style="font-family: Arial; padding: 20px;">
        <h2 style="text-align:center">SCHOOL FEE RECEIPT</h2><hr/>
        <p><b>Student ID:</b> ${fee.studentId}</p>
        <p><b>Name:</b> ${fee.name}</p>
        <p><b>Class:</b> ${fee.class}</p>
        <p><b>Term:</b> ${fee.term}</p><hr/>
        <p><b>Total Amount:</b> ₦${Number(fee.amount).toLocaleString()}</p>
        <p><b>Amount Paid:</b> ₦${Number(fee.amountPaid).toLocaleString()}</p>
        <p><b>Balance:</b> ₦${Number(fee.balance).toLocaleString()}</p>
        <p><b>Status:</b> ${fee.status}</p><hr/>
        <p style="text-align:center">Thank you!</p>
        <script>window.print();</script>
      </body></html>
  `);
    printWindow.document.close();
  };

  const handleExport = () => {
    const data = fees.map((f) => ({
      "Student ID": f.studentId,
      Name: f.name,
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

  const handleView = (fee) => setViewingFee(fee);
  const handleWhatsApp = (fee) => {
    const message = `Hello ${fee.name} Parent,%0A%0A*SCHOOL FEE RECEIPT*%0A%0AStudent ID: ${fee.studentId}%0AClass: ${fee.class}%0ATerm: ${fee.term}%0A%0ATotal Amount: ₦${Number(fee.amount).toLocaleString()}%0AAmount Paid: ₦${Number(fee.amountPaid).toLocaleString()}%0ABalance: ₦${Number(fee.balance).toLocaleString()}%0AStatus: ${fee.status}%0A%0AThank you!`;
    const url = `https://wa.me/?text=${message}`;
    window.open(url, "_blank");
  };

  return (
    <div className="p-4 md:p-6 text-white space-y-6 pb-20">
      <h2 className="text-2xl md:text-3xl font-bold">Fee Management</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by StudentID, Name, or Class..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-96 mb-4 p-3 rounded bg-gray-600 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* ADD PAYMENT FORM */}
      <div className="bg-purple-900 p-4 md:p-6 rounded-xl shadow-lg">
        <h3 className="text-xl md:text-2xl font-bold mb-4">Add Payment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: 1 col mobile, 4 cols desktop */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              name="studentId"
              placeholder="Student ID"
              className="w-full p-3 rounded bg-sky-200 text-black"
              value={form.studentId}
              onChange={handleChange}
              required
            />
            <input
              name="name"
              placeholder="Student Name"
              className="w-full p-3 rounded bg-sky-200 text-black"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="class"
              placeholder="Class"
              className="w-full p-3 rounded bg-sky-200 text-black"
              value={form.class}
              onChange={handleChange}
              required
            />
            <input
              name="term"
              placeholder="Term"
              className="w-full p-3 rounded bg-sky-200 text-black"
              value={form.term}
              onChange={handleChange}
              required
            />
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              name="type"
              placeholder="Fee Type"
              className="w-full p-3 rounded bg-sky-200 text-black"
              value={form.type}
              onChange={handleChange}
              required
            />
            <input
              name="amount"
              type="number"
              placeholder="Amount"
              className="w-full p-3 rounded bg-sky-200 text-black"
              value={form.amount}
              onChange={handleChange}
              required
            />
            <input
              name="amountPaid"
              type="number"
              placeholder="Amount Paid"
              className="w-full p-3 rounded bg-sky-200 text-black"
              value={form.amountPaid}
              onChange={handleChange}
            />
            <input
              name="parentNumber"
              type="number"
              placeholder="Parent Phone"
              className="w-full p-3 rounded bg-sky-200 text-black"
              value={form.parentNumber}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-bold"
          >
            Add Payment
          </button>
        </form>
      </div>

      {/* SUMMARY CARDS + EXPORT */}
      <div>
        <h3 className="text-xl md:text-2xl font-bold mb-4">Payment Records</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-[#74a378] rounded-lg">
            <h4 className="text-sm">Total Paid</h4>
            <h2 className="text-2xl font-bold text-green-900">
              ₦{totalPaid.toLocaleString()}
            </h2>
          </div>
          <div className="p-4 bg-[#0dad3d] rounded-lg">
            <h4 className="text-sm">Total Amount</h4>
            <h2 className="text-2xl font-bold">
              ₦{totalAmount.toLocaleString()}
            </h2>
          </div>
          <div className="p-4 bg-[#550f03] rounded-lg">
            <h4 className="text-sm">Total Balance</h4>
            <h2 className="text-2xl font-bold text-red-400">
              ₦{totalBalance.toLocaleString()}
            </h2>
          </div>
          <button
            onClick={handleExport}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded font-bold"
          >
            Export to Excel
          </button>
        </div>

        {/* TABLE WITH HORIZONTAL SCROLL */}
        <div className="overflow-x-auto overflow-y-visible bg-purple-900 rounded-xl p-2">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-3 text-left">StudentID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Term</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Paid</th>
                <th className="p-3 text-left">Balance</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFees.map((fee) => (
                <tr
                  key={fee._id}
                  className="border-b border-gray-700 hover:bg-gray-800"
                >
                  <td className="p-3">{fee.studentId}</td>
                  <td className="p-3">{fee.name}</td>
                  <td className="p-3">{fee.class}</td>
                  <td className="p-3">{fee.term}</td>
                  <td className="p-3">
                    ₦{Number(fee.amount).toLocaleString()}
                  </td>
                  <td className="p-3">
                    ₦{Number(fee.amountPaid).toLocaleString()}
                  </td>
                  <td className="p-3">
                    ₦{Number(fee.balance).toLocaleString()}
                  </td>
                  <td className="p-3">{fee.status}</td>
                  <td className="p-3">
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
                        className="bg-green-700 px-2 py-1 rounded text-xs"
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

      {/* EDIT MODAL */}
      {editingFee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Edit Payment for {editingFee.name}
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="number"
                className="w-full p-3 rounded bg-gray-600"
                value={editingFee.amountPaid}
                onChange={(e) =>
                  setEditingFee({ ...editingFee, amountPaid: e.target.value })
                }
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-red-600 px-4 py-2 rounded"
                  onClick={() => setEditingFee(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewingFee && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          onClick={() => setViewingFee(null)}
        >
          <div
            className="bg-white p-6 rounded-lg w-full max-w-md text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Payment Details</h3>
            <p>
              <b>Student:</b> {viewingFee.name}
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
              <b>Amount:</b> ₦{Number(viewingFee.amount).toLocaleString()}
            </p>
            <p>
              <b>Paid:</b> ₦{Number(viewingFee.amountPaid).toLocaleString()}
            </p>
            <button
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => setViewingFee(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="h-10 md:hiddden"></div>
    </div>
  );
};

export default Fees;
