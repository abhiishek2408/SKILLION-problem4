// src/pages/Register.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      const res = await axios.post("https://skillion-problem4.onrender.com/api/auth/register", form);

      // Safe access with optional chaining
      const userEmail = res.data.user?.email || form.email;

      setMessage(`✅ ${res.data.message} Check your email (${userEmail}) to verify.`);
      setIsError(false);
      setEmailSent(true);
      setForm({ name: "", email: "", password: "" });

      console.log("✅ Registration successful:", res.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Error registering user. Please try again.";

      setMessage(errorMessage);
      setIsError(true);

      console.error("❌ Registration failed:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!form.email) return;
    setLoading(true);
    try {
      const res = await axios.post("https://skillion-problem4.onrender.com/api/auth/resend-verification", { email: form.email });
      setMessage(`✅ Verification email resent to ${form.email}.`);
      setIsError(false);
      console.log("✅ Resend email response:", res.data);
    } catch (err) {
      setMessage("❌ Failed to resend verification email. Try again.");
      setIsError(true);
      console.error("❌ Resend email failed:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150";

  const buttonClasses =
    "w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 shadow-md";

  const messageClasses = isError
    ? "text-red-600 bg-red-100"
    : "text-green-600 bg-green-100";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          <button type="submit" className={buttonClasses} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {emailSent && (
          <button
            onClick={handleResendEmail}
            className="w-full py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-150 mt-2"
            disabled={loading}
          >
            {loading ? "Resending..." : "Resend Verification Email"}
          </button>
        )}

        {message && (
          <p className={`text-sm font-medium p-3 rounded-lg text-center ${messageClasses}`}>
            {message}
          </p>
        )}

        <p className="text-center text-gray-600 text-sm pt-2">
          Already have an account?
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:text-blue-800 ml-1 transition duration-150"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
