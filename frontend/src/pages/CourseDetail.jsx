import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:3000/api";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [progress, setProgress] = useState({ completedLessonIds: [] });
  const [enrolled, setEnrolled] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch course
        const courseRes = await axios.get(`${API_BASE}/courses/course-detail/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setCourse(courseRes.data.course);

        // Check enrollment
        const enrollmentRes = await axios.get(`${API_BASE}/enroll/check/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setEnrolled(enrollmentRes.data.enrolled);

        if (enrollmentRes.data.enrolled) {
          // Fetch lessons
          const lessonRes = await axios.get(`${API_BASE}/lessions/get-all-lesson/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          setLessons(lessonRes.data.items || []);
          if (lessonRes.data.items?.length > 0) setActiveLessonId(lessonRes.data.items[0]._id);

          // Fetch progress
          const progressRes = await axios.get(`${API_BASE}/progress/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          setProgress(progressRes.data || { completedLessonIds: [] });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch course details or lessons.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const handleLessonSelect = (lessonId) => {
    setActiveLessonId(lessonId);
    setTimeout(() => {
      videoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  // Automatically mark lesson complete when video ends
  const markLessonComplete = async (lessonId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/progress/${id}/toggle`,
        { lessonId },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setProgress(res.data);
    } catch (err) {
      console.error("Failed to mark lesson complete:", err);
    }
  };

  if (loading) return <div className="text-center p-10 text-indigo-600 font-semibold">Loading course details...</div>;
  if (error) return <div className="text-center text-red-600 p-10 font-semibold">{error}</div>;
  if (!course) return <div className="text-center text-gray-600 p-10">No course found.</div>;

  const activeLesson = lessons.find(l => l._id === activeLessonId);
  const progressPercent = lessons.length > 0
    ? ((progress.completedLessonIds?.length || 0) / lessons.length) * 100
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      {lessons.length > 0 && (
        <div className="md:w-1/4 bg-indigo-50 p-4 rounded-2xl border border-indigo-100 max-h-screen overflow-y-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Lessons</h3>
          <div className="space-y-2">
            {lessons.map(lesson => {
              const isActive = lesson._id === activeLessonId;
              const isCompleted = progress.completedLessonIds?.includes(lesson._id);
              return (
                <div
                  key={lesson._id}
                  className={`p-3 rounded-xl border transition flex justify-between items-center cursor-pointer
                    ${isActive ? "bg-indigo-100 border-indigo-400 font-semibold" : "bg-white border-indigo-200 hover:bg-indigo-50"}`}
                  onClick={() => handleLessonSelect(lesson._id)}
                >
                  <span>
                    {lesson.order}. {lesson.title} {isCompleted && "✅"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div className="h-3 bg-green-500 rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{Math.round(progressPercent)}% completed</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="md:flex-1 space-y-6">
        <Link to="/dashboard" className="inline-block mb-4 px-4 py-2 border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition">
          ← Back to Courses
        </Link>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h2>
          <p className="text-gray-700 mb-3">{course.description}</p>
          <div className="flex flex-wrap text-gray-600 text-sm gap-4">
            <span>Lessons: <b>{course.lessonsCount}</b></span>
            <span>Published: <b>{course.published ? "Yes ✅" : "No ❌"}</b></span>
            <span>Created: {new Date(course.createdAt).toLocaleString()}</span>
          </div>

          {!enrolled ? (
            <button
              onClick={async () => {
                const token = localStorage.getItem("token");
                await axios.post(`${API_BASE}/enroll/${id}/enroll`, {}, { headers: { Authorization: `Bearer ${token}` } });
                window.location.reload();
              }}
              className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Enroll Now
            </button>
          ) : (
            <div className="mt-6 text-green-600 font-semibold">Already Enrolled ✅</div>
          )}
        </div>

        {/* Active Lesson Video */}
        {activeLesson && (
          <div ref={videoRef} className="bg-white p-6 rounded-2xl border border-indigo-100">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">{activeLesson.title}</h3>
            <p className="text-gray-700 mb-4">{activeLesson.description}</p>
            {activeLesson.videoUrl && (
              <video
                src={activeLesson.videoUrl}
                controls
                autoPlay
                className="w-full max-h-[500px] rounded-xl border border-indigo-200"
                onEnded={() => markLessonComplete(activeLesson._id)} // <-- auto mark complete
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
