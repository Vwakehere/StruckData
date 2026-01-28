
import { GoogleGenAI } from "@google/genai";
import { AlgorithmType } from "../types";

export async function getAlgorithmInsight(algorithm: AlgorithmType): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As an expert computer scientist, explain the practical implications and real-world usage of ${algorithm}. Why would a developer choose this over other O(n log n) or O(n^2) algorithms? Keep it concise and insightful. Use markdown for formatting.`,
    config: {
      temperature: 0.7,
      maxOutputTokens: 500,
    }
  });
  return response.text || "No insights available at the moment.";
}
