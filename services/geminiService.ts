
import { GoogleGenAI } from "@google/genai";
import { SearchResult } from "../types";

export const getLiveAIData = async (query: string): Promise<SearchResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Forneça informações atualizadas sobre a seguinte IA ou tendência de IA: ${query}. 
      Inclua: utilidade principal, versões atuais e preços estimados. 
      Responda em Português do Brasil de forma concisa e amigável.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const answer = response.text || "Não foi possível obter uma resposta no momento.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = chunks
      .filter(chunk => chunk.web)
      .map(chunk => ({
        title: chunk.web?.title || "Fonte",
        uri: chunk.web?.uri || "#"
      }));

    return {
      answer,
      sources: sources.slice(0, 5) // Limit to top 5 sources
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      answer: "Ocorreu um erro ao consultar as informações mais recentes. Por favor, tente novamente.",
      sources: []
    };
  }
};
