
import { GoogleGenAI } from "@google/genai";
import { SearchResult } from "../types";

export const getLiveAIData = async (query: string): Promise<SearchResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Forneça informações atualizadas sobre: ${query}. Responda em Português de forma concisa.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const answer = response.text || "Sem resposta.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = chunks
      .filter(chunk => chunk.web)
      .map(chunk => ({
        title: chunk.web?.title || "Fonte",
        uri: chunk.web?.uri || "#"
      }));

    return { answer, sources: sources.slice(0, 5) };
  } catch (error) {
    console.error(error);
    return { answer: "Erro ao consultar a rede.", sources: [] };
  }
};
