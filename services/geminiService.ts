
import { GoogleGenAI } from "@google/genai";

// Standard initialization using named parameter for apiKey.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImageFromPrompt = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Generate a high-quality, clean, flat-design illustration suitable for a Perler bead pattern. 
            The subject is: ${prompt}. Use bold colors, clear outlines, and avoid gradients.`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

export const analyzePalette = async (imageUrl: string) => {
  try {
    const base64 = imageUrl.split(',')[1];
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64,
            },
          },
          {
            text: "Analyze the main colors in this image and describe the subject for a crafting project.",
          }
        ]
      },
    });
    // Correctly using .text property.
    return response.text;
  } catch (error) {
    console.error("Error analyzing palette:", error);
    return null;
  }
};
