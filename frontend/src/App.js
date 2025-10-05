import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LearnerDashboard from "./pages/LearnerDashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Certificate from "./pages/Certificate";

import CreatorCourses from "./pages/CreatorCourses";
import CreatorLession from "./pages/CreatorLession";
import CreatorDashboard from "./pages/CreatorDashboard";
import CreatorApply from "./pages/CreatorApply";


import AdminDashboard from "./pages/AdminDashboard";
import ManageUser from "./pages/ManageUser";
import ManageCourse from "./pages/ManageCourse";
import ManageCreators from "./pages/ManageCreators";






import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
    
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:token" element={<VerifyEmail />} />

          <Route path="/dashboard" element={<LearnerDashboard />}>
            <Route index element={<Courses />} />
            <Route path="courses" element={<Courses />} />
            <Route path="course-detail/:id" element={<CourseDetail />} />
            <Route path="certificate/:courseId" element={<Certificate />} />
            <Route path="apply" element={<CreatorApply />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="/creator/dashboard" element={<CreatorDashboard />}>
            <Route index element={<CreatorCourses />} />
            <Route path="courses" element={<CreatorCourses />} />
            <Route path="creatorlession" element={<CreatorLession />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            <Route index element={<ManageUser />} />
            <Route path="manageuser" element={<ManageUser />} />
            <Route path="managecourse" element={<ManageCourse />} />
            <Route path="managecreators" element={<ManageCreators />} />
          </Route>

      
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

