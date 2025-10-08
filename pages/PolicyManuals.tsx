
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import FileUpload from '../components/FileUpload';
import Icon from '../components/Icon';

const PolicyManuals: React.FC = () => {
  const { files, addFile } = useAppContext();
  const policyFiles = files.filter(file => file.type === 'policy');

  const handleFileUpload = (file: File) => {
    addFile(file, 'policy');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <FileUpload 
          onFileUpload={handleFileUpload} 
          title="Upload Policy Manual"
          description="These documents provide context for all AI interactions."
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Uploaded Policy Manuals ({policyFiles.length})</h2>
        {policyFiles.length > 0 ? (
          <ul className="space-y-3">
            {policyFiles.map((file) => (
              <li key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex items-center">
                  <Icon name="policy" className="w-5 h-5 mr-3 text-blue-500" />
                  <span className="font-medium">{file.name}</span>
                </div>
                {/* Placeholder for actions like view or delete */}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No policy manuals have been uploaded yet. Upload one to provide context to the AI.</p>
        )}
      </div>
    </div>
  );
};

export default PolicyManuals;
