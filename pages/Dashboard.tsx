
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';

const featureCards = [
    { title: 'Email Crafter', description: 'Draft professional emails with AI assistance.', icon: 'email', path: '/email-crafter' },
    { title: 'Policy Manuals', description: 'Upload and manage policy documents for contextual lookups.', icon: 'policy', path: '/policy-manuals' },
    { title: 'Document Analysis', description: 'Analyze documents for potential issues and inconsistencies.', icon: 'analysis', path: '/document-analysis' },
    { title: 'Document Editor', description: 'Create and edit appeals or other documents with AI support.', icon: 'editor', path: '/document-editor' }
];

const Dashboard: React.FC = () => {
  const { files } = useAppContext();
  
  const policyFiles = files.filter(f => f.type === 'policy');
  const documentFiles = files.filter(f => f.type === 'document');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to your AI Legal Dashboard</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Your central hub for context-aware document management and communication.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featureCards.map(card => (
            <Link to={card.path} key={card.title} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col items-start">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full mb-4">
                    <Icon name={card.icon} className="w-7 h-7 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm flex-grow">{card.description}</p>
                <div className="mt-4 text-blue-500 font-semibold">Go to {card.title} &rarr;</div>
            </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Active Context: Policy Manuals ({policyFiles.length})</h3>
            {policyFiles.length > 0 ? (
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {policyFiles.map(file => <li key={file.id} className="text-gray-600 dark:text-gray-300 truncate">{file.name}</li>)}
                </ul>
            ) : (
                <p className="text-gray-500 dark:text-gray-400">No policy manuals uploaded yet.</p>
            )}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Active Context: Documents ({documentFiles.length})</h3>
             {documentFiles.length > 0 ? (
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {documentFiles.map(file => <li key={file.id} className="text-gray-600 dark:text-gray-300 truncate">{file.name}</li>)}
                </ul>
            ) : (
                <p className="text-gray-500 dark:text-gray-400">No documents uploaded for analysis yet.</p>
            )}
        </div>
      </div>
       <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 rounded-r-lg" role="alert">
        <p className="font-bold">Demonstration Notice</p>
        <p>Uploaded files are stored in memory for this session only and will be cleared when you refresh the page. This is a frontend-only demonstration.</p>
      </div>
    </div>
  );
};

export default Dashboard;
