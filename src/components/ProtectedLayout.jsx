import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) return <Navigate to="/" />;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const NavLinks = () => (
    <>
      <Link
        to="/dashboard"
        onClick={() => setSidebarOpen(false)}
        className="p-3 rounded-lg hover:bg-purple-800"
      >
        Dashboard
      </Link>
      <Link
        to="/students"
        onClick={() => setSidebarOpen(false)}
        className="p-3 rounded-lg hover:bg-purple-800"
      >
        Students
      </Link>
      <Link
        to="/registration"
        onClick={() => setSidebarOpen(false)}
        className="p-3 rounded-lg hover:bg-purple-800"
      >
        Registration
      </Link>
      <Link
        to="/teachers"
        onClick={() => setSidebarOpen(false)}
        className="p-3 rounded-lg hover:bg-purple-800"
      >
        Teachers
      </Link>
      <Link
        to="/classes"
        onClick={() => setSidebarOpen(false)}
        className="p-3 rounded-lg hover:bg-purple-800"
      >
        Classes
      </Link>
      <Link
        to="/results"
        onClick={() => setSidebarOpen(false)}
        className="p-3 rounded-lg hover:bg-purple-800"
      >
        Results
      </Link>
      <Link
        to="/Fees"
        onClick={() => setSidebarOpen(false)}
        className="p-3 rounded-lg hover:bg-purple-800"
      >
        Fees
      </Link>
      <button
        type="button"
        onClick={() => {
          handleLogout();
          setSidebarOpen(false);
        }}
        className="p-3 rounded-lg text-red-400 text-left hover:bg-red-900"
      >
        Logout
      </button>
    </>
  );

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="flex m-h-screen bg-[#0a0f1e] text-white">
        {/* SIDEBAR - Mobile: slide in, Desktop: always visible */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-purple-700 p-4 transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:inset-0 transition duration-300 ease-in-out`}
        >
          <h2 className="text-3xl font-bold text-cyan-400 mb-8">EDUVICKO</h2>
          <nav className="flex flex-col gap-2">
            <NavLinks />
          </nav>
        </aside>

        {/* OVERLAY - only on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col">
          {/* TOP BAR - Only shows on mobile */}
          <header className="md:hidden bg-[#0a0f1e] p-4 sticky top-0 z-10 border-b border-gray-800">
            <button onClick={() => setSidebarOpen(true)} className="text-3xl">
              ☰
            </button>
          </header>

          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default ProtectedLayout;
