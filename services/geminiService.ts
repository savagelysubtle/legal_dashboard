
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash';

export const streamChatResponse = async (history: ChatMessage[], newPrompt: string, context: string) => {
  const chat = ai.chats.create({
    model,
    history,
    config: {
      systemInstruction: `You are a helpful AI assistant for legal and policy matters. Use the provided context from internal documents and policy manuals to give the most accurate and relevant answers. CONTEXT: """${context}"""`,
    },
  });

  return chat.sendMessageStream({ message: newPrompt });
};


export const generateEmailDraft = async (
  originalEmail: string,
  goal: string,
  context: string
): Promise<string> => {
  const prompt = `
    You are an expert in professional and legal communications.
    Your task is to draft a polite and effective email reply.

    **Provided Context from Policy Manuals and Documents:**
    ---
    ${context || 'No additional context provided.'}
    ---

    **Original Email to Reply To:**
    ---
    ${originalEmail}
    ---

    **My Goal for This Reply:**
    ---
    ${goal}
    ---

    Based on all the information above, please draft the email reply.
    The reply should be professional, clear, and achieve the specified goal while adhering to any relevant policies from the context.
    Do not include a subject line unless it's necessary to suggest a change.
    Focus only on the body of the email.
  `;

  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
  } catch (error) {
    console.error("Error generating email draft:", error);
    return "Sorry, I couldn't generate a draft at this time. Please check the console for errors.";
  }
};


export const analyzeDocumentForIssues = async (
  documentContent: string,
  context: string
): Promise<string> => {
  const prompt = `
    You are an AI legal assistant. Your task is to analyze the following document for potential issues, inconsistencies, or areas of concern.
    Use the provided context from policy manuals to inform your analysis.

    **Provided Context from Policy Manuals:**
    ---
    ${context || 'No additional policy context provided.'}
    ---

    **Document for Analysis:**
    ---
    ${documentContent}
    ---

    Please provide a summary of your findings.
    Highlight potential risks, contradictions with policy, unclear language, or missing information.
    Format your analysis in clear, easy-to-understand points using markdown.
  `;

  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
  } catch (error) {
    console.error("Error analyzing document:", error);
    return "Sorry, I couldn't analyze the document at this time. Please check the console for errors.";
  }
};

export const generateDocumentText = async (
  currentDocument: string,
  instruction: string,
  context: string,
): Promise<string> => {
    const prompt = `
    You are an AI assistant helping a user write a document.
    
    **Provided Context from Policy Manuals and Other Documents:**
    ---
    ${context || 'No additional context provided.'}
    ---

    **Current Document Content:**
    ---
    ${currentDocument}
    ---

    **User's Instruction:**
    ---
    ${instruction}
    ---

    Based on the user's instruction, please generate the requested text.
    If the user wants to add to the document, provide the new text.
    If the user wants to rewrite a section, provide the rewritten section.
    Be concise and directly address the user's instruction.
  `;

  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
  } catch (error) {
    console.error("Error generating document text:", error);
    return "Sorry, I couldn't generate text at this time. Please check the console for errors.";
  }
};
