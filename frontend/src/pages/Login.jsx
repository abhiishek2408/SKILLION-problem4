import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login, loading } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await login(form.email, form.password);
    if (!res.success) {
      setError(res.message);
    }
  };

  const inputClasses =
    "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150";

  const buttonClasses =
    "w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 shadow-md";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {error && (
            <p className="text-red-600 text-sm font-medium bg-red-100 p-2 rounded-lg text-center">
              {error}
            </p>
          )}

          <button type="submit" className={buttonClasses} disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm">
          Don't have an account?
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:text-blue-800 ml-1 transition duration-150"
          >
            Register here
          </Link>
        </p>

      <p>
        Need test credentials?{" "}
        <Link to="/user-credentials" style={{ color: "blue", textDecoration: "underline" }}>
          Click here
        </Link>
      </p>

      </div>
    </div>
  );
}

export default Login;
