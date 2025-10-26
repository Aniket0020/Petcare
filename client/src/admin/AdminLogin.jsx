import { useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const adminLogin = () => {
  const URL = import.meta.env.VITE_API_URL;
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!name.trim() || !password.trim()) {
      toast.warn("Please enter vaild name and password");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${URL}/admin/login`, {
        name,
        password,
      });

      const token = data.token;
      if (!token) {
        toast.error("Login failed. No token received");
        return;
      }
      localStorage.setItem("token", token);
      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl mb-6 text-center font-bold text-gray-800">
          Admin Login
        </h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white font-semibold transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default adminLogin;
