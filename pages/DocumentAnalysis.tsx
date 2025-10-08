
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { AppFile } from '../types';
import FileUpload from '../components/FileUpload';
import { analyzeDocumentForIssues } from '../services/geminiService';
import Icon from '../components/Icon';

const DocumentAnalysis: React.FC = () => {
  const { files, addFile, getCombinedContext } = useAppContext();
  const documentFiles = files.filter(file => file.type === 'document');
  const [selectedFile, setSelectedFile] = useState<AppFile | null>(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (file: File) => {
    addFile(file, 'document');
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert('Please select a document to analyze.');
      return;
    }
    setIsLoading(true);
    setAnalysisResult('');
    try {
      const context = getCombinedContext();
      const result = await analyzeDocumentForIssues(selectedFile.content, context);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisResult('An error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <FileUpload 
            onFileUpload={handleFileUpload}
            title="Upload Document"
            description="Upload a document for analysis."
          />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Uploaded Documents</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {documentFiles.map(file => (
              <button
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-3 rounded-md transition-colors ${selectedFile?.id === file.id ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                {file.name}
              </button>
            ))}
            {documentFiles.length === 0 && <p className="text-gray-500">No documents uploaded.</p>}
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Analysis Report</h2>
            <button
                onClick={handleAnalyze}
                disabled={!selectedFile || isLoading}
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center"
            >
                {isLoading && <Icon name="spinner" className="animate-spin mr-2" />}
                Analyze Selected Document
            </button>
        </div>
        <div className="flex-grow p-4 border rounded-md bg-gray-50 dark:bg-gray-900 overflow-y-auto">
            {isLoading ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <Icon name="spinner" className="animate-spin w-8 h-8" />
                    <span className="ml-3">Analyzing...</span>
                </div>
            ) : analysisResult ? (
                 <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, '<br />') }}></div>
            ) : (
                <div className="flex items-center justify-center h-full text-center text-gray-500">
                    <p>Select a document and click "Analyze" to see the AI-generated report here.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalysis;
