// src/pages/CreatorLesson.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://skillion-problem4.onrender.com/api/lessions";

const CreatorLesson = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);

  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    videoUrl: "",
    order: 1,
  });

  const token = localStorage.getItem("token");

  const fetchLessons = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get-all-lessons`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setLessons(res.data.items || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch lessons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const openAddModal = () => {
    setFormData({ courseId: "", title: "", description: "", videoUrl: "", order: 1 });
    setShowAddModal(true);
  };

  const openEditModal = (lesson) => {
    setCurrentLesson(lesson);
    setFormData({
      courseId: lesson.courseId._id,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      order: lesson.order,
    });
    setShowEditModal(true);
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE}/${formData.courseId}/lessons`,
        formData,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setLessons((prev) => [...prev, res.data.lesson]);
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error?.message || "Error adding lesson.");
    }
  };

  const handleEditLesson = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_BASE}/update-lesson/${currentLesson._id}`,
        formData,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setLessons((prev) =>
        prev.map((l) => (l._id === currentLesson._id ? res.data.lesson : l))
      );
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error?.message || "Error updating lesson.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await axios.delete(`${API_BASE}/delete-lesson/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setLessons((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error?.message || "Error deleting lesson.");
    }
  };

  if (loading)
    return (
      <div className="text-center p-10 text-indigo-600 font-semibold">
        Loading lessons...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 p-10 font-semibold">{error}</div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header + Add button */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">
          Creator Lesson Dashboard
        </h2>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          + Add New Lesson
        </button>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {lessons.length === 0 && (
          <div className="bg-gray-100 p-6 rounded text-gray-600 text-center">
            No lessons available yet.
          </div>
        )}

        {lessons.map((lesson) => (
          <div
            key={lesson._id}
            className="bg-white border border-gray-200 p-5 rounded-lg flex justify-between items-center hover:bg-indigo-50 transition"
          >
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{lesson.title}</h4>
              <p className="text-gray-600 text-sm line-clamp-2">{lesson.description}</p>
              <p className="text-gray-500 text-xs">
                Course: {lesson.courseId?.title || "Unknown"} | Order: {lesson.order}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => openEditModal(lesson)}
                className="text-indigo-600 font-medium hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(lesson._id)}
                className="text-red-600 font-medium hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Lesson Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Lesson</h3>
            <form onSubmit={handleAddLesson} className="space-y-3">
              <input
                type="text"
                placeholder="Course ID"
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Video URL"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Order"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lesson Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Lesson</h3>
            <form onSubmit={handleEditLesson} className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Video URL"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Order"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorLesson;
