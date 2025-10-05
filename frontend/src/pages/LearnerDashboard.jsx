import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

import { Outlet } from 'react-router-dom';


const UserDashboard = () => {
  return (
    
    <div className="flex flex-col min-h-screen">
      
      <Navbar/>
      
      {/* Main content area - takes available space */}
      <main className="flex-grow"> 
        <Outlet />
      </main>
      
      {/* Footer with Top Margin */}
      <Footer className="mt-16" /> 
      
    </div>

  );
};

export default UserDashboard;