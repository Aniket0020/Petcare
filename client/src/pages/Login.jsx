import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const Login = () => {
  const URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${URL}/${values.role}/login`, {
        email: values.email,
        password: values.password,
      });

      const token = response.data.token;
      if (!token) return navigate("/login");

      localStorage.setItem("token", token);
      localStorage.setItem("role", values.role);

      navigate(values.role === "doctor" ? "/dashboard" : "/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between shadow-2xl rounded-3xl overflow-hidden">
        {/* Left Side Image */}

        <div className="md:w-[60%] w-full shadow-2xl rounded-3xl relative">
          <img
            className="w-full h-48 sm:h-64 md:h-full object-cover"
            src={error ? "/img/login.jpg" : "/img/login2.jpg"}
            alt="Pet NFC Tag"
          />
          {/* Error */}
          {error && (
            <p className="text-red-600 text-center text-2xl p-15 pt-50 bg-gradient-to-t from-red-100 to-transparent rounded-lg absolute bottom-0 w-full ">
              {error}
            </p>
          )}
        </div>

        {/* Right Side Form */}
        <div
          className={`backdrop-blur-md border border-gray-200 bg-white/90 p-6 sm:p-8 md:p-10 w-full max-w-md mx-auto flex flex-col justify-center y-center `}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 tracking-tight">
            Welcome Back 🐾
          </h2>

          <Formik
            initialValues={{ email: "", password: "", role: "user" }}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                    placeholder="you@example.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                    placeholder="••••••••"
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Login as
                  </label>
                  <Field
                    as="select"
                    name="role"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                  >
                    <option value="user">User</option>
                    <option value="doctor">Doctor</option>
                  </Field>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className={`w-full text-white py-3 rounded-xl transition duration-300 font-semibold shadow-md ${
                    loading
                      ? "bg-indigo-400"
                      : "bg-indigo-600 hover:bg-indigo-500"
                  }`}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                {/* Forgot Password */}
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </Form>
            )}
          </Formik>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
