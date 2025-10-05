import React from 'react';
import CreatorSidebar from './CreatorSidebar';
import { Outlet } from 'react-router-dom';



const CreatorDashboard = () => {
  return (
    
    <div className="flex flex-col min-h-screen">
      
      <CreatorSidebar/>
  
      <main className="flex-grow"> 
        <Outlet />
      </main>
      
    </div>

  );
};

export default CreatorDashboard;