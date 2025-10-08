
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { generateEmailDraft } from '../services/geminiService';
import Icon from '../components/Icon';

const EmailCrafter: React.FC = () => {
  const [originalEmail, setOriginalEmail] = useState('');
  const [goal, setGoal] = useState('');
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { getCombinedContext } = useAppContext();

  const handleGenerateDraft = async () => {
    if (!originalEmail || !goal) {
      alert('Please provide the original email and your goal.');
      return;
    }
    setIsLoading(true);
    setDraft('');
    try {
      const context = getCombinedContext();
      const result = await generateEmailDraft(originalEmail, goal, context);
      setDraft(result);
    } catch (error) {
      console.error(error);
      setDraft('An error occurred while generating the draft.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Input Panel */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Craft Your Email</h2>
        <div className="space-y-6 flex-grow flex flex-col">
          <div className="flex flex-col flex-grow">
            <label htmlFor="original-email" className="font-semibold mb-2">Original Email Content</label>
            <textarea
              id="original-email"
              value={originalEmail}
              onChange={(e) => setOriginalEmail(e.target.value)}
              placeholder="Paste the email you are replying to here..."
              className="flex-grow p-3 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="goal" className="font-semibold mb-2">What is your goal?</label>
            <textarea
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., 'Politely decline the request, citing policy section 3.A', 'Ask for clarification on the deadline'"
              className="p-3 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
        </div>
        <button
          onClick={handleGenerateDraft}
          disabled={isLoading}
          className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? <Icon name="spinner" className="animate-spin mr-2" /> : 'Generate Draft'}
        </button>
      </div>

      {/* Output Panel */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Generated Draft</h2>
        <div className="flex-grow p-3 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 whitespace-pre-wrap font-mono text-sm overflow-y-auto">
          {isLoading ? (
             <div className="flex items-center justify-center h-full text-gray-500">
                <Icon name="spinner" className="animate-spin w-8 h-8" />
             </div>
          ) : (
            draft || <span className="text-gray-400">Your AI-generated email draft will appear here...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailCrafter;
