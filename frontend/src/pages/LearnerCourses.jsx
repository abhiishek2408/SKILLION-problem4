// LearnerCourses.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const LearnerCourses = () => {
  const [courses, setCourses] = useState([]);
  const [nextOffset, setNextOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async (offset = 0) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/courses?limit=5&offset=${offset}`);
      if (offset === 0) {
        setCourses(res.data.courses);
      } else {
        setCourses(prev => [...prev, ...res.data.courses]);
      }
      setNextOffset(res.data.nextOffset);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Courses</h1>
      <div className="space-y-4">
        {courses.map(course => (
          <div key={course._id} className="border p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-gray-700">{course.description}</p>
            {course.published ? (
              <span className="text-green-600 font-bold">Published</span>
            ) : (
              <span className="text-red-600 font-bold">Draft</span>
            )}
          </div>
        ))}
      </div>

      {nextOffset && (
        <button
          onClick={() => fetchCourses(nextOffset)}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};

export default LearnerCourses;
