import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const API_BASE = "https://skillion-problem4.onrender.com/api";

const Certificate = () => {
  const { courseId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const certificateRef = useRef();

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/certificate/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCertificate(res.data.certificate);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to fetch certificate.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCertificate();
  }, [courseId]);

  const downloadPDF = () => {
    const input = certificateRef.current;
    html2canvas(input, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${certificate.userId.name}-Certificate.pdf`);
    });
  };

  if (loading)
    return <div className="text-center p-10 text-indigo-600 font-semibold">Loading certificate...</div>;
  if (error)
    return <div className="text-center text-red-600 p-10 font-semibold">{error}</div>;
  if (!certificate)
    return <div className="text-center text-gray-600 p-10">No certificate found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <Link
        to="/dashboard"
        className="inline-block mb-6 px-4 py-2 border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition"
      >
        ← Back to Courses
      </Link>

      {/* Certificate Card */}
      <div
        ref={certificateRef}
        className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 p-10 rounded-3xl border-8 border-white shadow-xl text-center relative overflow-hidden"
      >
        {/* Decorative Lines */}
        <div className="absolute top-0 left-0 w-full h-full border-4 border-dashed border-white opacity-20 rounded-3xl pointer-events-none"></div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-widest">
          Certificate of Completion
        </h2>
        <p className="text-lg text-white mb-6">This is to certify that</p>
        <h3 className="text-3xl md:text-4xl font-extrabold text-yellow-100 mb-4">
          {certificate.userId.name}
        </h3>
        <p className="text-lg text-white mb-4">has successfully completed the course</p>
        <h3 className="text-3xl md:text-4xl font-extrabold text-yellow-100 mb-4">
          {certificate.courseId.title}
        </h3>

        <p className="text-white mt-6">Issued on: {new Date(certificate.issuedAt).toLocaleDateString()}</p>
        <p className="text-white text-sm mt-2">Serial: {certificate.serial}</p>
      </div>

      {/* Download Button */}
      <div className="text-center mt-6">
        <button
          onClick={downloadPDF}
          className="px-8 py-3 bg-yellow-400 text-indigo-900 font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Certificate;
