
import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { streamChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import Icon from './Icon';

const ChatPanel: React.FC = () => {
  const { isChatOpen, setIsChatOpen, chatHistory, setChatHistory, getCombinedContext } = useAppContext();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newUserMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    const newHistory = [...chatHistory, newUserMessage];
    setChatHistory(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const context = getCombinedContext();
      const stream = await streamChatResponse(chatHistory, input, context);
      
      let newModelMessage: ChatMessage = { role: 'model', parts: [{ text: '' }] };
      setChatHistory(prev => [...prev, newModelMessage]);

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        newModelMessage.parts[0].text += chunkText;
        setChatHistory(prev => {
            const updatedHistory = [...prev];
            updatedHistory[updatedHistory.length - 1] = { ...newModelMessage };
            return updatedHistory;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Sorry, I encountered an error. Please try again." }] };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Open Chat"
        >
          <Icon name="chat" />
        </button>
      )}

      <div className={`fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isChatOpen ? 'translate-x-0' : 'translate-x-[120%]'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-lg">Context-Aware Chat</h3>
          <button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
            <Icon name="close" />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {chatHistory.length === 0 ? (
             <div className="flex items-center justify-center h-full text-center text-gray-500">
                <p>Ask me anything about your uploaded documents.</p>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
            <div key={index} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                {msg.parts[0].text}
              </div>
            </div>
          ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
            disabled={isLoading}
          />
          <button type="submit" className="ml-3 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed" disabled={isLoading}>
            {isLoading ? <Icon name="spinner" className="animate-spin" /> : <Icon name="send" />}
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatPanel;
