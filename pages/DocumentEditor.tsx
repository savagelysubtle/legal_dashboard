
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { generateDocumentText } from '../services/geminiService';
import Icon from '../components/Icon';

const DocumentEditor: React.FC = () => {
  const [documentContent, setDocumentContent] = useState('');
  const [instruction, setInstruction] = useState('');
  const [isLoading, setIsLoading] =useState(false);
  const { getCombinedContext } = useAppContext();

  const handleGenerateText = async () => {
    if (!instruction) {
      alert('Please provide an instruction for the AI.');
      return;
    }
    setIsLoading(true);
    try {
      const context = getCombinedContext();
      const result = await generateDocumentText(documentContent, instruction, context);
      setDocumentContent(prev => `${prev}\n\n${result}`);
      setInstruction('');
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Document Crafter</h2>
        <textarea
          value={documentContent}
          onChange={(e) => setDocumentContent(e.target.value)}
          placeholder="Start writing your document here..."
          className="flex-grow w-full p-4 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-serif"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
        <h2 className="text-2xl font-bold mb-4">AI Assistant</h2>
        <div className="flex-grow flex flex-col">
          <label htmlFor="instruction" className="font-semibold mb-2">Instruction</label>
          <textarea
            id="instruction"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g., 'Write an opening paragraph for an appeal letter regarding a denied claim.' or 'Rephrase the last paragraph to be more assertive.'"
            className="flex-grow p-3 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={8}
          />
        </div>
        <button
          onClick={handleGenerateText}
          disabled={isLoading}
          className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center"
        >
          {isLoading ? <Icon name="spinner" className="animate-spin mr-2"/> : <Icon name="plus" className="mr-2" />}
          Generate & Add
        </button>
      </div>
    </div>
  );
};

export default DocumentEditor;
