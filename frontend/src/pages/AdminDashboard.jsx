import React from 'react';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';




const AdminDashboard = () => {
  return (
    
    <div className="flex flex-col min-h-screen">
      
      <AdminSidebar/>
  
      <main className="flex-grow"> 
        <Outlet />
      </main>
      
    </div>

  );
};

export default AdminDashboard;