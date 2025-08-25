import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DashboardNavbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const userRole = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
    };

    const renderLinks = () => (
      <>
        {userRole === "doctor" && (
          <Link
            to="/dashboard"
            className="text-black !no-underline hover:underline"
          >
            Dashboard
          </Link>
        )}
        <Link
          to="/profile"
          className="text-black !no-underline hover:underline"
        >
          Profile
        </Link>

        {userRole === "doctor" && (
          <>
            <Link
              to="/all"
              className="text-black !no-underline hover:underline"
            >
              Users
            </Link>
            <Link
              to="/petlist"
              className="text-black !no-underline hover:underline"
            >
              Pet List
            </Link>
          </>
        )}

        {userRole === "user" && (
          <>
            <Link
              to="/create"
              className="text-black !no-underline hover:underline"
            >
              Create Pet
            </Link>
            <Link
              to="/petlist"
              className="text-black !no-underline hover:underline"
            >
              Your Pet
            </Link>
          </>
        )}
        <button
          onClick={handleLogout}
          className="bg-white text-emerald-600 px-3 py-1 rounded-md hover:bg-gray-100"
        >
          Logout
        </button>
      </>
    );

    return (
        <nav className=" text-black font-semibold p-4 shadow-md relative z-50 " >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-3xl font-bold font-dance">Pet Care</h1>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-4">
                    {renderLinks()}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Sliding Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed top-0 right-0 w-64 h-full bg-cover bg-center shadow-xl p-6 z-50 text-emerald-600 text-lg font-semibold flex flex-col gap-6 md:hidden"
                        style={{ backgroundImage: "url('/img/menu2.jpeg')" }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-emerald-600">Menu</h2>
                            <button onClick={() => setMenuOpen(false)}>
                                <X className="w-6 h-6 text-emerald-600" />
                            </button>
                        </div>

                        {renderLinks()}


                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default DashboardNavbar;
