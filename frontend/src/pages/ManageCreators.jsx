// src/pages/ManageCreators.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

const ManageCreators = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // ===== Fetch all creator applications =====
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/creators/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.applications);
    } catch (err) {
      console.error("Error fetching applications:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // ===== Approve or Reject an application =====
  const handleAction = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this application?`)) return;

    try {
      await axios.put(`${API_BASE}/api/creators/applications/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchApplications();
    } catch (err) {
      console.error(`Error ${action}ing application:`, err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Creator Applications</h1>

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Bio</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Submitted At</th>
                <th className="p-3 border-b">Reviewed At</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{app.userId.name}</td>
                  <td className="p-3 border-b">{app.userId.email}</td>
                  <td className="p-3 border-b">{app.bio}</td>
                  <td className="p-3 border-b">
                    {app.status === "PENDING" && "⏳ Pending"}
                    {app.status === "APPROVED" && "✅ Approved"}
                    {app.status === "REJECTED" && "❌ Rejected"}
                  </td>
                  <td className="p-3 border-b">{new Date(app.submittedAt).toLocaleString()}</td>
                  <td className="p-3 border-b">{app.reviewedAt ? new Date(app.reviewedAt).toLocaleString() : "-"}</td>
                  <td className="p-3 border-b flex justify-center gap-2">
                    {app.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleAction(app._id, "approve")}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(app._id, "reject")}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {app.status !== "PENDING" && <span className="text-gray-500">Reviewed</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageCreators;
