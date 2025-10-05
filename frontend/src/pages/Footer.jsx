import React from 'react';
import { Link } from 'react-router-dom';
// Import icons from react-icons (e.g., FaFacebook, FaTwitter, FaLinkedin)
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa'; 

const Footer = () => {
  // Define content for easy mapping and clean JSX
  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Press', path: '/press' },
    { name: 'Blog', path: '/blog' },
  ];

  const resources = [
    { name: 'FAQ', path: '/faq' },
    { name: 'Support', path: '/support' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
  ];

  const socialLinks = [
    { icon: FaFacebookF, url: 'https://facebook.com/myapp', label: 'Facebook' },
    { icon: FaTwitter, url: 'https://twitter.com/myapp', label: 'Twitter' },
    { icon: FaLinkedinIn, url: 'https://linkedin.com/company/myapp', label: 'LinkedIn' },
    { icon: FaGithub, url: 'https://github.com/myapp', label: 'GitHub' },
  ];

  const currentYear = new Date().getFullYear();

  const LinkItem = ({ path, name }) => (
    <li className="mb-2">
      <Link 
        to={path} 
        className="text-gray-400 hover:text-white transition duration-150 text-sm"
      >
        {name}
      </Link>
    </li>
  );

  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid Section (4 Columns on large screens) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Company Info & Logo */}
          <div>
            <Link to="/" className="text-white text-2xl font-extrabold tracking-wider mb-3 block">
              MyApp
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Building the future, one component at a time. Join us on our journey!
            </p>
            <p className="text-gray-500 text-xs">
              123 Dev Street, Suite 404
              <br/>
              React City, 10101
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h5 className="text-lg font-semibold mb-4 text-white">Quick Links</h5>
            <ul>
              {quickLinks.map((link) => (
                <LinkItem key={link.name} {...link} />
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h5 className="text-lg font-semibold mb-4 text-white">Resources</h5>
            <ul>
              {resources.map((link) => (
                <LinkItem key={link.name} {...link} />
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div>
            <h5 className="text-lg font-semibold mb-4 text-white">Get in Touch</h5>
            
            <p className="text-gray-400 text-sm mb-4">
              Email: <a href="mailto:support@myapp.com" className="hover:text-blue-400">support@myapp.com</a>
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4 mt-2">
              {socialLinks.map((social) => (
                <a 
                  key={social.label} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition duration-150"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <hr className="border-gray-700 my-6" />

        {/* Copyright Section */}
        <div className="text-center text-gray-500 text-sm">
          &copy; {currentYear} MyApp Inc. All rights reserved.
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;