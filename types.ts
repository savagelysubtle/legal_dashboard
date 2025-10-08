
export interface AppFile {
  id: string;
  name: string;
  content: string;
  type: 'policy' | 'document';
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface AppContextType {
  files: AppFile[];
  chatHistory: ChatMessage[];
  addFile: (file: File, type: 'policy' | 'document') => Promise<void>;
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getCombinedContext: () => string;
}
