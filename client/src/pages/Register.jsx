import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Register = () => {
const URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    role: "user",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
    role: Yup.string().oneOf(["user", "doctor"]).required("Role is required"),
  });

  const handleSubmit = async (values) => {
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${URL}/${values.role}/register`,
        values
      );
      if (response.data.status) {
        navigate("/login");
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-2 bg-gradient-to-br from-blue-50 to-indigo-50 ">
      <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-2xl p-7 rounded-3xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center  mb-5 tracking-tight">
          Create Account 🐶
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <Field
                  name="name"
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                  placeholder="Your name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

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
                  component="div"
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
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Register as
                </label>
                <Field
                  as="select"
                  name="role"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                >
                  <option value="user">User</option>
                  <option value="doctor">Doctor</option>
                </Field>
                <ErrorMessage
                  name="role"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className={`w-full text-white py-3 rounded-xl transition duration-300 font-semibold shadow-md ${
                  loading ? "bg-primary/80" : "bg-primary"
                }`}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
