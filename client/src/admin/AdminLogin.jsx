import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // make sure you installed react-hot-toast

const AdminLogin = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
      const res = await axios.post("http://localhost:3000/admin/login", {
        name,
        password,
      });

      const token = res.data.token;
      if (!token) {
        toast.error("Login failed");
        return;
      }

      localStorage.setItem("token", token);
      toast.success("Login successful");
      // Optionally redirect to admin dashboard
      window.location.href = "/admin/dashboard";
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl mb-4 text-center font-bold">Admin Login</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
