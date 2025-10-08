
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider } from './hooks/useAppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatPanel from './components/ChatPanel';
import Dashboard from './pages/Dashboard';
import EmailCrafter from './pages/EmailCrafter';
import PolicyManuals from './pages/PolicyManuals';
import DocumentAnalysis from './pages/DocumentAnalysis';
import DocumentEditor from './pages/DocumentEditor';

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <HashRouter>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/email-crafter" element={<EmailCrafter />} />
                <Route path="/policy-manuals" element={<PolicyManuals />} />
                <Route path="/document-analysis" element={<DocumentAnalysis />} />
                <Route path="/document-editor" element={<DocumentEditor />} />
              </Routes>
            </main>
          </div>
          <ChatPanel />
        </div>
      </HashRouter>
    </AppContextProvider>
  );
};

export default App;
