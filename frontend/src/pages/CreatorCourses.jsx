import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000/api";

// --- START: Simple Modal Component ---
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full relative">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
          {title}
        </h3>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};
// --- END: Simple Modal Component ---

function CreatorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // NEW STATE for detail modal
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/courses/my-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetFormAndCloseModal = () => {
    setForm({ title: "", description: "" });
    setEditingId(null);
    setShowModal(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/courses/add-course`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetFormAndCloseModal();
      fetchCourses();
    } catch (err) {
      console.error("Error creating course:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const id = editingId;
    if (!id) return;

    try {
      await axios.put(`${API_BASE}/courses/update-course/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetFormAndCloseModal();
      fetchCourses();
    } catch (err) {
      console.error("Error updating course:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`${API_BASE}/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course._id);
    setForm({ title: course.title, description: course.description });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ title: "", description: "" });
    setShowModal(true);
  };

  // 🟢 NEW: Handle View Course Detail
  const handleViewCourse = async (id) => {
    setDetailLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/courses/course-detail/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedCourse(res.data.course);
      setDetailModalOpen(true);
    } catch (err) {
      console.error("Error fetching course detail:", err);
      alert("Failed to load course details.");
    }
    setDetailLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-200 pb-4 mb-8">
        Creator Dashboard 👨‍💻
      </h2>

      <button
        onClick={openCreateModal}
        className="mb-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
      >
        ✨ Add New Course
      </button>

      <h3 className="text-2xl font-semibold text-gray-700 mb-6">
        Your Courses ({courses.length})
      </h3>
      {loading ? (
        <p className="text-gray-600 text-lg">Loading courses...</p>
      ) : courses.length === 0 ? (
        <div className="p-8 bg-gray-100 rounded-lg text-center text-gray-600 text-lg shadow-sm">
          <p>
            You haven't created any courses yet. Click "Add New Course" to get
            started! 🚀
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div
              key={c._id}
              className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between cursor-pointer"
              onClick={() => handleViewCourse(c._id)} // 🟢 open detail modal
            >
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {c.title}
                </h4>
                <p className="text-gray-700 mb-4 flex-grow">{c.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Status:{" "}
                  <b
                    className={`font-semibold ${
                      c.published ? "text-green-600" : "text-orange-500"
                    }`}
                  >
                    {c.published ? "Published" : "Unpublished"}
                  </b>
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent modal open
                      handleEdit(c);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent modal open
                      handleDelete(c._id);
                    }}
                    className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Course Form Modal --- */}
      <Modal
        isOpen={showModal}
        onClose={resetFormAndCloseModal}
        title={editingId ? "Edit Course" : "Create New Course"}
      >
        <form
          onSubmit={editingId ? handleUpdate : handleCreate}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Course Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g., Introduction to React"
              value={form.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Course Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="A brief overview of the course content."
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={resetFormAndCloseModal}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              {editingId ? "Save Changes" : "Create Course"}
            </button>
          </div>
        </form>
      </Modal>

      {/* 🟢 NEW: Course Detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={selectedCourse ? selectedCourse.title : "Course Detail"}
      >
        {detailLoading ? (
          <p className="text-gray-600 text-center">Loading details...</p>
        ) : selectedCourse ? (
          <div className="space-y-3">
            <p className="text-gray-700">
              <b>Description:</b> {selectedCourse.description}
            </p>
            <p className="text-gray-700">
              <b>Lessons:</b> {selectedCourse.lessonsCount || 0}
            </p>
            <p className="text-gray-700">
              <b>Status:</b>{" "}
              {selectedCourse.published ? (
                <span className="text-green-600 font-semibold">Published</span>
              ) : (
                <span className="text-orange-500 font-semibold">Unpublished</span>
              )}
            </p>
            <p className="text-sm text-gray-500">
              Created at:{" "}
              {new Date(selectedCourse.createdAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-600 text-center">No details available.</p>
        )}
      </Modal>
    </div>
  );
}

export default CreatorCourses;
