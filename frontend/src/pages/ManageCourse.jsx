import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "https://skillion-problem4.onrender.com";

const ManageCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // ===== Fetch all unpublished courses =====
  const fetchUnpublishedCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/api/courses/unpublished`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.courses);
    } catch (err) {
      console.error("Error fetching courses:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnpublishedCourses();
  }, []);

  // ===== Publish a course =====
  const handlePublish = async (id) => {
    if (!window.confirm("Are you sure you want to publish this course?")) return;
    try {
      await axios.put(
        `${API_BASE}/api/courses/publish/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUnpublishedCourses(); // refresh list
    } catch (err) {
      console.error("Error publishing course:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="px-10 lg:px-40 py-8">
      <h1 className="text-3xl font-semibold mb-6">Manage Courses (Unpublished)</h1>

      {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : courses.length === 0 ? (
        <div className="text-gray-500">No unpublished courses found.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 border-b">Title</th>
                <th className="p-3 border-b">Creator</th>
                <th className="p-3 border-b">Created At</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{course.title}</td>
                  <td className="p-3 border-b">{course.creatorId}</td>
                  <td className="p-3 border-b">{new Date(course.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 border-b text-center">
                    <button
                      onClick={() => handlePublish(course._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                    >
                      Publish
                    </button>
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

export default ManageCourse;
