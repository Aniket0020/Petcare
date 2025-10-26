import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const URL = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const res = await axios.post(`${URL}/auth/forgot-password`, { email });
      setMessage(res.data?.message || "Password reset link sent!");
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Enter your email to receive a reset link.
        </p>

        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Send Reset Link
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

export default ForgotPassword;
