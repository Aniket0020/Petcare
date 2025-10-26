import React, { useState } from "react";
import { Link } from "react-router-dom";

const DashboardNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const userRole = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white text-black font-semibold p-4 shadow-md  w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-3xl font-bold font-dance">Pet Care</h1>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/profile" className="hover:text-primary transition">
            Profile
          </Link>
          {userRole === "doctor" && (
            <>
              <Link to="/dashboard" className="hover:text-primary transition">
                Dashboard
              </Link>
              <Link to="/all" className="hover:text-primary transition">
                Users
              </Link>
              <Link to="/petlist" className="hover:text-primary transition">
                Pet List
              </Link>
            </>
          )}

          {userRole === "user" && (
            <>
              <Link to="/petlist" className="hover:text-primary transition">
                Your Pet
              </Link>
              <Link to="/create" className="hover:text-primary transition">
                Create Pet
              </Link>
            </>
          )}

          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-md hover:bg-gradient-to-l  "
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Right Side Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden z-50`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-primary">Menu</h2>
          <button onClick={() => setMenuOpen(false)} className="text-2xl">
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 p-4">
          {userRole === "doctor" && (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/all" onClick={() => setMenuOpen(false)}>
                Users
              </Link>
              <Link to="/petlist" onClick={() => setMenuOpen(false)}>
                Pet List
              </Link>
            </>
          )}

          {userRole === "user" && (
            <>
              <Link to="/create" onClick={() => setMenuOpen(false)}>
                Create Pet
              </Link>
              <Link to="/petlist" onClick={() => setMenuOpen(false)}>
                Your Pet
              </Link>
            </>
          )}

          <Link to="/profile" onClick={() => setMenuOpen(false)}>
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:bg-gradient-to-l text-white px-3 py-1 rounded-md  transition mt-4"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Background Overlay when menu is open */}
      {menuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/20 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default DashboardNavbar;
