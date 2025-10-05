// CreatorCourses.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const CreatorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMyCourses = async () => {
    try {
      const res = await axios.get("/api/my-courses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setCourses(res.data.courses);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        // Update existing course
        await axios.put(`/api/courses/${editingId}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      } else {
        // Create new course
        await axios.post("/api/courses", form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      }
      setForm({ title: "", description: "" });
      setEditingId(null);
      fetchMyCourses();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleEdit = course => {
    setForm({ title: course.title, description: course.description });
    setEditingId(course._id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Course Title"
          className="border p-2 rounded w-full"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Course Description"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          {loading ? "Saving..." : editingId ? "Update Course" : "Create Course"}
        </button>
      </form>

      <div className="space-y-4">
        {courses.map(course => (
          <div
            key={course._id}
            className="border p-4 rounded shadow hover:shadow-lg transition flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-gray-700">{course.description}</p>
              <span className={course.published ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {course.published ? "Published" : "Draft"}
              </span>
            </div>
            <button
              onClick={() => handleEdit(course)}
              className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatorCourses;
