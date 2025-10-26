import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Logged out successfully!");
    navigate("/admin"); // redirect to admin login
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow">
      <h1 className="text-lg font-semibold">Admin Dashboard</h1>

      <div className="flex items-center gap-4">
        <Link to="/admin/dashboard" className="text-white hover:underline">
          Users
        </Link>
        <Link to="/qr" className="text-white hover:underline">
          QR
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 text-sm transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
