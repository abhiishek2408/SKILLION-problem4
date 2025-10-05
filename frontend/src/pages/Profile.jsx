// src/pages/Profile.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, role, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg">No user found. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">My Profile</h2>

        <div className="space-y-4">
          <div>
            <p className="text-gray-500 font-semibold">Name:</p>
            <p className="text-gray-800">{user.name || "Not provided"}</p>
          </div>

          <div>
            <p className="text-gray-500 font-semibold">Email:</p>
            <p className="text-gray-800">{user.email}</p>
          </div>

          <div>
            <p className="text-gray-500 font-semibold">Role:</p>
            <p className="text-gray-800 capitalize">{role || "User"}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-150 shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
