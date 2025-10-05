import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    FaHome, FaCog, FaBars, 
    FaTimes, FaChevronLeft, FaChevronRight, 
    FaRProject
} from 'react-icons/fa';


const CreatorSidebar = () => {
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false); 
    const [isMinimized, setIsMinimized] = useState(false);


    const sidebarLinks = [
        { name: 'Courses', path: '/creator/dashboard', icon: FaHome },
        { name: 'Lession', path: '/creator/dashboard/creatorlession', icon: FaRProject },
    ];

    // --- Tailwind Classes ---
    const widthClass = isMinimized ? 'w-20' : 'w-64';
    const baseLinkClasses = "flex items-center p-3 rounded-lg transition-colors duration-200 text-sm font-medium whitespace-nowrap overflow-hidden";
    const iconBaseClasses = "w-5 h-5 flex-shrink-0"; // Added flex-shrink-0

    // Helper to determine if a link is active
    const isActive = (path) => location.pathname.startsWith(path);

    // Toggle sidebar visibility on mobile
    const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

    // Toggle sidebar minimization on desktop
    const toggleMinimize = () => setIsMinimized(!isMinimized);

    return (
        <>
            {/* 1. Mobile Menu Button (Hamburger) */}
            <div className="md:hidden p-4 bg-gray-900 border-b border-gray-800 fixed w-full z-40">
                <button 
                    onClick={toggleMobileSidebar}
                    className="text-white hover:text-indigo-400 focus:outline-none"
                    aria-label="Toggle sidebar menu"
                >
                    {isMobileOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                </button>
            </div>

            {/* 2. Backdrop for Mobile Sidebar */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" 
                    onClick={toggleMobileSidebar}
                ></div>
            )}

            {/* 3. Sidebar Container */}
            <aside 
                className={`
                    fixed top-0 left-0 h-full bg-gray-900 shadow-xl border-r border-gray-800 
                    transform transition-all duration-300 z-50 md:z-10
                    ${widthClass}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0
                `}
                aria-label="Creator navigation menu"
            >
                <div className="flex flex-col h-full pt-16 md:pt-0">
                    
                    {/* Logo/Minimize Area */}
                    <div className={`p-4 flex items-center ${isMinimized ? 'justify-center' : 'justify-between'} border-b border-gray-800`}>
                        {/* Logo Text (Hidden when minimized) */}
                        {!isMinimized && (
                            <Link to="/creator/dashboard" className="text-2xl font-black tracking-tighter text-white">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
                                    Creator Hub
                                </span>
                            </Link>
                        )}
                        
                        {/* Minimize Button (Desktop Only) */}
                        <button 
                            onClick={toggleMinimize}
                            className="hidden md:block p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition duration-200"
                            aria-label={isMinimized ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {isMinimized ? <FaChevronRight className="w-4 h-4" /> : <FaChevronLeft className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                        {sidebarLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMobileOpen(false)} // Close mobile menu on link click
                                className={`${baseLinkClasses} 
                                    ${isActive(link.path) 
                                        ? 'bg-indigo-600 text-white shadow-lg' 
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`
                                }
                            >
                                <link.icon className={`${iconBaseClasses} ${!isMinimized && 'mr-3'}`} />
                                {/* Link Name (Visible only when not minimized) */}
                                {!isMinimized && link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Settings/Footer Link */}
                    <div className="p-4 border-t border-gray-800">
                        <Link 
                            to="/creator/settings"
                            onClick={() => setIsMobileOpen(false)}
                            className={`${baseLinkClasses} text-gray-400 hover:bg-gray-700 hover:text-white`}
                        >
                            <FaCog className={`${iconBaseClasses} ${!isMinimized && 'mr-3'}`} />
                            {!isMinimized && 'Settings'}
                        </Link>
                    </div>
                </div>
            </aside>
            
            {/* 4. Main Content Spacing Div */}
            {/* This div dynamically pushes the main content based on sidebar state */}
            <div className={`hidden md:block ${widthClass} flex-shrink-0 transition-all duration-300`}></div>
        </>
    );
};

export default CreatorSidebar;