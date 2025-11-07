import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-indigo-600 text-white shadow-sm border-b border-gray-200 sticky top-0 z-1000">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight font-dance ">
          Pet Care
        </h1>
        <nav className="flex gap-8 text-lg font-medium">
          <Link
            className=" !no-underline hover:text-orange-400 transition"
            to="/"
          >
            Home
          </Link>
          <Link
            className="  !no-underline hover:text-orange-400 transition"
            to="/login"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
