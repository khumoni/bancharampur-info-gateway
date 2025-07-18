import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

// Fallback to use REST API instead of SDK for browser compatibility
const PROJECT_ID = 'bancharampur-digital-infoguide';
const LOCATION = 'us-central1';
const MODEL_ID = 'gemini-1.5-flash-002';

// Use REST API endpoint instead of SDK
const getVertexAIEndpoint = () => {
  return `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:generateContent`;
};

export type VertexMessage = { 
  role: "user" | "model", 
  parts: { text: string }[] 
};

export async function chatWithVertexAI(
  history: VertexMessage[],
  prompt: string,
  language: "bn" | "en" = "bn"
): Promise<string> {
  try {
    // Enhanced system context for Bancharampur
    const systemContext = language === "bn" 
      ? `আপনি বাঞ্ছারামপুর উপজেলার একজন স্থানীয় তথ্য সহকারী। আপনার কাজ হল:
        - স্থানীয় সরকারি অফিস, হাসপাতাল, শিক্ষা প্রতিষ্ঠান সম্পর্কে তথ্য দেওয়া
        - বাজারের দাম, পরিবহন, জরুরি সেবা সম্পর্কে সাহায্য করা
        - কৃষি, স্বাস্থ্যসেবা, শিক্ষার বিষয়ে পরামর্শ দেওয়া
        - সর্বদা বাংলায় উত্তর দিন এবং স্থানীয় প্রেক্ষাপট মাথায় রাখুন`
      : `You are a local information assistant for Bancharampur Upazila. Your role is to:
        - Provide information about local government offices, hospitals, educational institutions
        - Help with market prices, transportation, emergency services
        - Give advice on agriculture, healthcare, education
        - Always respond in English and consider local context`;

    // Prepare chat history including system context
    const allMessages = [
      { role: "user" as const, parts: [{ text: systemContext }] },
      ...history,
      { role: "user" as const, parts: [{ text: prompt }] }
    ];

    // Log chat interaction to Firestore for analytics
    try {
      await addDoc(collection(db, 'ai_interactions'), {
        prompt,
        language,
        timestamp: new Date(),
        model: 'gemini-fallback'
      });
    } catch (logError) {
      console.warn('Failed to log AI interaction:', logError);
    }

    // Fallback to existing Gemini service
    const { chatWithGemini } = await import('./geminiAI');
    return await chatWithGemini(history, prompt);
  } catch (error) {
    console.error('Vertex AI Error:', error);
    
    // Fallback to existing Gemini service if Vertex AI fails
    const { chatWithGemini } = await import('./geminiAI');
    return await chatWithGemini(history, prompt);
  }
}

// Enhanced AI features for local context
export async function getLocalRecommendation(
  category: string, 
  userQuery: string, 
  language: "bn" | "en" = "bn"
): Promise<string> {
  const contextPrompt = language === "bn"
    ? `বাঞ্ছারামপুর উপজেলার ${category} বিষয়ে এই প্রশ্নের উত্তর দিন: ${userQuery}`
    : `Answer this question about ${category} in Bancharampur Upazila: ${userQuery}`;
  
  return await chatWithVertexAI([], contextPrompt, language);
}