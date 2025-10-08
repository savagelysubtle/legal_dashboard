
import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from './Icon';

const navigationLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { name: 'Email Crafter', path: '/email-crafter', icon: 'email' },
  { name: 'Policy Manuals', path: '/policy-manuals', icon: 'policy' },
  { name: 'Document Analysis', path: '/document-analysis', icon: 'analysis' },
  { name: 'Document Editor', path: '/document-editor', icon: 'editor' },
];

const Sidebar: React.FC = () => {
  const linkClasses = "flex items-center px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200";
  const activeLinkClasses = "bg-blue-600 text-white";

  return (
    <div className="w-64 bg-gray-800 text-white flex-shrink-0 flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
        Aegis AI
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            <Icon name={link.icon} className="w-5 h-5 mr-3" />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
