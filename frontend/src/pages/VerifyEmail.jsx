// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";

// function VerifyEmail() {
//   const { token } = useParams(); // now matches /verify/:token
//   const [status, setStatus] = useState("Verifying...");
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     const verifyEmail = async () => {
//       if (!token) {
//         setStatus("Invalid verification link.");
//         return;
//       }

//       try {
//         const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://skillion-problem4.onrender.com";
//         const res = await axios.get(`${backendUrl}/api/auth/verify/${token}`);

//         setStatus(res.data.message || "Email verified! You can now login.");
//         setSuccess(true);
//       } catch (err) {
//         console.error("Verification error:", err.response?.data || err.message);
//         setStatus(err.response?.data?.message || "Invalid or expired verification link.");
//       }
//     };

//     verifyEmail();
//   }, [token]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-6 text-center">
//         <h2 className="text-3xl font-bold text-gray-800">Email Verification</h2>
//         <p className={`text-lg ${success ? "text-green-600" : "text-red-600"}`}>{status}</p>

//         {success && (
//           <Link
//             to="/login"
//             className="mt-4 inline-block py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
//           >
//             Go to Login
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// }

// export default VerifyEmail;


import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const { token } = useParams(); // matches /verify/:token
  const [status, setStatus] = useState("Verifying...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("Invalid verification link.");
        return;
      }

      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://skillion-problem4.onrender.com";
        const res = await axios.get(`${backendUrl}/api/auth/verify/${token}`);

        setStatus(res.data.message || "Email verified! You can now login.");
        setSuccess(true);
      } catch (err) {
        console.error("Verification error:", err.response?.data || err.message);
        setStatus(err.response?.data?.error || "Invalid or expired verification link.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Email Verification</h2>
        <p className={`text-lg ${success ? "text-green-600" : "text-red-600"}`}>{status}</p>

        {success && (
          <Link
            to="/login"
            className="mt-4 inline-block py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
          >
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
