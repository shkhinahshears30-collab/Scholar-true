
import { GoogleGenAI, Type } from "@google/genai";

let apiCooldownUntil = 0;
const greetingCache: Record<string, { text: string; timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 30;

async function callGeminiWithRetry(fn: (ai: any) => Promise<any>, maxRetries = 3): Promise<any> {
  const now = Date.now();
  if (now < apiCooldownUntil) throw new Error("API_COOLDOWN");

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      return await fn(ai);
    } catch (error: any) {
      if (error?.status === 429) {
        apiCooldownUntil = Date.now() + 60000;
        throw new Error("API_COOLDOWN");
      }
      if (attempt < maxRetries - 1) {
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
        continue;
      }
      throw error;
    }
  }
}

export const getCompanionMessage = async (companionName: string, growth: number, isFocusing: boolean, language: string = 'English'): Promise<string> => {
  const cacheKey = `${companionName}-${isFocusing ? 'focus' : 'idle'}-${language}`;
  if (greetingCache[cacheKey] && (Date.now() - greetingCache[cacheKey].timestamp < CACHE_TTL)) return greetingCache[cacheKey].text;

  try {
    const response = await callGeminiWithRetry(async (ai) => {
      return await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are ${companionName}. Greet the student. Mode: ${isFocusing ? 'focus' : 'idle'}. Growth: ${growth}%. Language: ${language}. Keep it 1 short sentence.`,
      });
    });
    const text = response.text?.trim() || "Let's work!";
    greetingCache[cacheKey] = { text, timestamp: Date.now() };
    return text;
  } catch { return isFocusing ? "Stay focused!" : "Ready?"; }
};

export const getDefinition = async (word: string): Promise<{ definition: string; example: string }> => {
  try {
    const response = await callGeminiWithRetry(async (ai) => {
      return await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Define the word "${word}". Return JSON with "definition" and "example".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              definition: { type: Type.STRING },
              example: { type: Type.STRING }
            },
            required: ["definition", "example"]
          }
        }
      });
    });
    return JSON.parse(response.text);
  } catch { return { definition: "Could not find definition.", example: "N/A" }; }
};

export const generateSpellingQuiz = async (level: string): Promise<{ word: string; hint: string }[]> => {
  try {
    const response = await callGeminiWithRetry(async (ai) => {
      return await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 5 spelling quiz words for level "${level}". Return JSON array of objects with "word" and "hint".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                hint: { type: Type.STRING }
              },
              required: ["word", "hint"]
            }
          }
        }
      });
    });
    return JSON.parse(response.text);
  } catch { return []; }
};

export const researchQuery = async (query: string): Promise<{ text: string, sources: { uri: string, title: string }[] }> => {
  try {
    const response = await callGeminiWithRetry(async (ai) => {
      return await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
    });
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter((c: any) => c.web)
      ?.map((c: any) => ({ uri: c.web.uri, title: c.web.title })) || [];
    return { text: response.text || "", sources };
  } catch { return { text: "Search failed.", sources: [] }; }
};

export const analyzeImage = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    const response = await callGeminiWithRetry(async (ai) => {
      return await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
            { text: prompt }
          ]
        },
      });
    });
    return response.text || "Could not analyze image.";
  } catch { return "Error analyzing image."; }
};

export const generateVeoVideo = async (base64Image: string, prompt: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: {
      imageBytes: base64Image,
      mimeType: 'image/jpeg',
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  return `${downloadLink}&key=${process.env.API_KEY}`;
};

export const checkGrammar = async (text: string): Promise<{ corrected: string; explanation: string }> => {
  try {
    const response = await callGeminiWithRetry(async (ai) => {
      return await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Proofread this text: "${text}". Return JSON with "corrected" version and a short "explanation" of changes.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              corrected: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["corrected", "explanation"]
          }
        }
      });
    });
    return JSON.parse(response.text);
  } catch { return { corrected: text, explanation: "Could not check grammar right now." }; }
};

export const generateFlashcards = async (content: string): Promise<{ question: string; answer: string }[]> => {
  try {
    const response = await callGeminiWithRetry(async (ai) => {
      return await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 5 flashcards from: ${content}. Return JSON array.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING }
              }
            }
          }
        }
      });
    });
    return JSON.parse(response.text || "[]");
  } catch { return []; }
};

export const verifyFlashcardAnswer = async (question: string, expectedAnswer: string, userSpokenText: string): Promise<{ correct: boolean; feedback: string }> => {
  try {
    const response = await callGeminiWithRetry(async (ai) => {
      return await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Q: "${question}" Exp: "${expectedAnswer}" User: "${userSpokenText}". Is it semantically correct? Return JSON with "correct" (bool) and "feedback" (string).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              correct: { type: Type.BOOLEAN },
              feedback: { type: Type.STRING }
            }
          }
        }
      });
    });
    return JSON.parse(response.text);
  } catch { return { correct: false, feedback: "Error." }; }
};
