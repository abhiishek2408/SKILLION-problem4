// src/pages/CreatorApply.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

const CreatorApply = () => {
  const [bio, setBio] = useState("");
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const token = localStorage.getItem("token");

  // ===== Fetch current user's application =====
  const fetchApplication = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/creators/my-application`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplication(res.data.application);
      setSubmitted(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setApplication(null);
        setSubmitted(false);
      } else {
        console.error("Error fetching application:", err.response?.data || err.message);
      }
    }
  };

  useEffect(() => {
    fetchApplication();
  }, []);

  // ===== Submit new application =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/api/creators/apply`,
        { bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplication(res.data.application);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting application:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Apply to Become a Creator</h1>

      {submitted && application ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Your Application Status</h2>
          <p><strong>Bio:</strong> {application.bio}</p>
          <p>
            <strong>Status:</strong>{" "}
            {application.status === "PENDING" && "⏳ Pending Review"}
            {application.status === "APPROVED" && "✅ Approved"}
            {application.status === "REJECTED" && "❌ Rejected"}
          </p>
          {application.reviewedAt && (
            <p>
              <strong>Reviewed At:</strong>{" "}
              {new Date(application.reviewedAt).toLocaleString()}
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              placeholder="Tell us about yourself..."
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreatorApply;
