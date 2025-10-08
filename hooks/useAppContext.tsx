
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AppFile, ChatMessage, AppContextType } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<AppFile[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const addFile = useCallback(async (file: File, type: 'policy' | 'document') => {
    try {
      const content = await readFileAsText(file);
      const newFile: AppFile = {
        id: `${file.name}-${Date.now()}`,
        name: file.name,
        content,
        type,
      };
      setFiles((prevFiles) => [...prevFiles, newFile]);
    } catch (error) {
      console.error("Error reading file:", error);
      // Handle error, maybe show a notification to the user
    }
  }, []);

  const getCombinedContext = useCallback(() => {
    if (files.length === 0) {
      return "No files have been uploaded yet.";
    }
    return files
      .map(file => `--- Document: ${file.name} (${file.type}) ---\n${file.content}`)
      .join('\n\n');
  }, [files]);

  const value = {
    files,
    chatHistory,
    addFile,
    setChatHistory,
    isChatOpen,
    setIsChatOpen,
    getCombinedContext,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
