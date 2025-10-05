import React, { useEffect, useState } from "react";
import axios from "axios";

function Progress() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token"); // if using JWT
        const res = await axios.get("https://skillion-problem4.onrender.com/api/progress", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setProgress(res.data.items || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch progress");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) return <p>Loading progress...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Your Progress</h2>
      {progress.map((p) => (
        <div key={p.courseId} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
          <h4>{p.courseTitle}</h4>
          <p>Completed: {p.percentage}%</p>
        </div>
      ))}
    </div>
  );
}

export default Progress;
