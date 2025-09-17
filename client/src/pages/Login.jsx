import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-5xl  flex flex-col md:flex-row justify-between shadow-2xl rounded-3xl md:rounded-3xl ">
        <div className="md:w-[60%] w-full relative ">
          <img
            className="w-full h-64 md:h-full object-cover  rounded-l-3xl md:rounded-l-3xl"
            src="/img/login2.jpg"
            alt="Pet NFC Tag"
          />
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-gray-200  p-7  w-full max-w-md mx-auto  rounded-r-3xl md:rounded-r-3xl">
          <h2 className="text-3xl font-bold text-center mb-5 tracking-tight">
            Welcome Back 🐾
          </h2>

          <Formik
            initialValues={{ email: "", password: "", role: "user" }}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                    placeholder="you@example.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                    placeholder="••••••••"
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Login as
                  </label>
                  <Field
                    as="select"
                    name="role"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                  >
                    <option value="doctor">Doctor</option>
                    <option value="user">User</option>
                  </Field>
                </div>

                {error && (
                  <p className="text-red-600 text-center mb-4 p-4 ">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className={`w-full bg-primary text-white py-3 rounded-xl hover:bg-primary/80 transition duration-300 font-semibold shadow-md  ${
                    loading ? "bg-primary/80" : "bg-primary"
                  }`}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/Register"
              className="text-primary hover:underline font-medium"
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
