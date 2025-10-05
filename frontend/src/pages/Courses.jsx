// src/pages/Courses.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://skillion-problem4.onrender.com/api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/courses`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setCourses(res.data.items || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch courses. Please check the server connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading)
    return (
      <div className="text-center p-10 text-indigo-600 font-semibold">
        Loading courses...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 p-10 font-semibold">{error}</div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-10">
        Explore All Courses 📚
      </h2>

      {courses.length === 0 ? (
        <div className="bg-indigo-50 p-10 rounded-3xl text-center text-gray-600 text-lg font-medium">
          No published courses available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((c) => (
            <div
              key={c._id}
              onClick={() => navigate(`/dashboard/course-detail/${c._id}`)}
              className="cursor-pointer bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-3xl border border-indigo-100 transition-transform hover:scale-105 hover:from-indigo-100 hover:to-purple-100"
            >
              {/* Course Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 truncate">
                {c.title}
              </h3>

              {/* Course Description */}
              <p className="text-gray-700 line-clamp-4 mb-4">{c.description}</p>

              {/* Tags / Info */}
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    c.published
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {c.published ? "Published ✅" : "Draft ❌"}
                </span>
                <span className="text-indigo-600 font-medium text-sm">
                  View Details →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
