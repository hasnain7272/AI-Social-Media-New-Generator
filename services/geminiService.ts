
import { GoogleGenAI, Type } from "@google/genai";
import type { NewsArticle } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const newsArticleSchema = {
    type: Type.OBJECT,
    properties: {
        headline: {
            type: Type.STRING,
            description: "A compelling news headline, under 15 words."
        },
        fullText: {
            type: Type.STRING,
            description: "The full text of the news article, approximately 200-250 words."
        }
    },
    required: ['headline', 'fullText']
};

export const fetchTrendingNews = async (limit: number): Promise<NewsArticle[]> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Act as a news API. Generate a list of ${limit} trending news articles from the past 24 hours. For each article, provide a compelling headline and a full text of about 200-250 words.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: newsArticleSchema
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        const articles = JSON.parse(jsonText);
        return articles;
    } catch (e) {
        console.error("Failed to parse news articles JSON:", e);
        throw new Error("The AI returned an invalid format for news articles.");
    }
};

export const generateCaption = async (headline: string, fullText: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate an engaging and insightful social media caption (150-200 words) for the following news article. Start with a strong hook and end with a question to encourage engagement. Do not include hashtags.\n\nHeadline: ${headline}\n\nArticle: ${fullText}`,
        config: {
            temperature: 0.8,
        }
    });
    return response.text.trim();
};

export const generateHashtags = async (headline: string, content: string): Promise<string[]> => {
     const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate 8-10 relevant and trending hashtags for a social media post about this topic. Include a mix of broad and niche tags.\n\nHeadline: ${headline}\n\nContent: ${content}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING,
                    description: "A single hashtag string, starting with '#'."
                }
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        const hashtags = JSON.parse(jsonText);
        return hashtags;
    } catch (e) {
        console.error("Failed to parse hashtags JSON:", e);
        throw new Error("The AI returned an invalid format for hashtags.");
    }
};

export const generateImageSearchKeywords = async (headline: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Extract the 2-3 most important and visually descriptive keywords from the following headline for an image search. Return only the keywords separated by a space.\n\nHeadline: "${headline}"`,
        config: {
            thinkingConfig: { thinkingBudget: 0 } // low latency needed
        }
    });
    return response.text.trim();
};
