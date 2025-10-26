import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const URL = import.meta.env.VITE_API_URL;
  const { token } = useParams(); // only token needed
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const res = await fetch(`${URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      setMessage(data.message || "Password reset complete!");

      if (res.ok) {
        setTimeout(() => navigate("/login"), 2000); // redirect after 2s
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Reset Password
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Enter your new password below.
        </p>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
        >
          Reset Password
        </button>

        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
