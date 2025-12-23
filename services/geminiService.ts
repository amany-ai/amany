
import { GoogleGenAI, Type } from "@google/genai";
import { EstimationResult } from "../types";
import { ROWAD_ESTIMATION_RULES } from "../constants";

const extractJson = (text: string | undefined) => {
  if (!text) return null;
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  } catch (e) {
    console.error("JSON Extraction failed", e);
    return null;
  }
};

export const estimateSalesFromBRD = async (
  brdContent: string, 
  options: { 
    isPremiumWeb: boolean, 
    complexity: 'Low' | 'Medium' | 'High',
    googleDocLink?: string,
    attachments?: string[]
  }
): Promise<EstimationResult | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are a Technical Project Manager at Rowad (rh.net.sa), a Saudi software company.
    Strictly follow Rowad's internal estimation methodology for all outputs.
    
    ESTIMATION RULES:
    1. PROJECT SCOPE: Identify platforms (Backend, Admin, Web, Android, iOS).
    2. BACKEND: Estimated by number of modules. REUSABLE MODULES (${ROWAD_ESTIMATION_RULES.REUSABLE_MODULES.join(', ')}) reduce time.
    3. ADMIN PANEL: Duration MUST EQUAL EXACTLY 20% of the Backend duration.
    4. WEB: Standard = 30 days. Premium = 36 days (30 + 20%).
    5. MOBILE: Android/iOS based on screens/flows. Reuse between platforms reduces total time.
    6. QA: FIXED DURATION of 10 days.
    7. EXTERNAL INTEGRATIONS: (Payment gateways, Maps, SMS, Nafath) - List them but EXCLUDE from the timeline. Mention they must comply with Saudi regulations.
    8. COMPLEXITY BUFFER: Low (0%), Medium (+10%), High (+20%) added to the FINAL SUM.
    
    Output a professional, technical JSON report.
  `;

  const prompt = `
    TECHNICAL REQUIREMENTS: ${brdContent}
    GOOGLE DOC CONTEXT: ${options.googleDocLink || 'None'}
    ATTACHED FILENAMES: ${options.attachments?.join(', ') || 'None'}
    WEBSITE TIER: ${options.isPremiumWeb ? 'Premium' : 'Standard'}
    COMPLEXITY INPUT: ${options.complexity}
    
    Calculate the exact breakdown for: Backend, Admin, Web, Android, iOS, QA.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalDurationDays: { type: Type.NUMBER },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                backend: { type: Type.NUMBER },
                admin: { type: Type.NUMBER },
                web: { type: Type.NUMBER },
                android: { type: Type.NUMBER },
                ios: { type: Type.NUMBER },
                qa: { type: Type.NUMBER }
              },
              required: ["backend", "admin", "web", "android", "ios", "qa"]
            },
            complexity: { type: Type.STRING },
            reusableModulesFound: { type: Type.ARRAY, items: { type: Type.STRING } },
            externalIntegrations: { type: Type.ARRAY, items: { type: Type.STRING } },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            justification: { type: Type.STRING },
            validationChecklist: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["totalDurationDays", "breakdown", "complexity", "reusableModulesFound", "externalIntegrations", "risks", "justification", "validationChecklist"]
        }
      }
    });

    return extractJson(response.text);
  } catch (error) {
    console.error("Rowad Estimation Error:", error);
    return null;
  }
};

export const analyzeSRS = async (content: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze this SRS for a Saudi 22-day production cycle. Focus on feasibility.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: content,
    });
    return response.text;
  } catch (error) { return null; }
};

export const processAICommand = async (input: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: input,
      config: {
        systemInstruction: "You are the Rowad PM assistant. Use the navigate tool if the user wants to see a section."
      }
    });
    return response.functionCalls || [];
  } catch (e) { return []; }
};

export const getProjectInsights = async (project: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Status: ${JSON.stringify(project)}`,
    });
    return response.text;
  } catch (e) { return null; }
};

export const generateTestSuite = async (srs: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a suite of automated test cases for: ${srs}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              platform: { type: Type.STRING },
              priority: { type: Type.STRING },
              type: { type: Type.STRING },
              automationScript: { type: Type.STRING }
            }
          }
        }
      }
    });
    return extractJson(response.text) || [];
  } catch (e) { return []; }
};

export const generateApiBlueprint = async (requirement: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate Laravel 11 API blueprint for: ${requirement}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            databaseSchema: { type: Type.STRING },
            endpoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  method: { type: Type.STRING },
                  path: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

export const analyzeFigmaDesign = async (image?: string, link?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const parts: any[] = [{ text: `Analyze this Figma design and suggest backend architecture: ${link || ""}` }];
    if (image) {
      parts.push({ inlineData: { mimeType: 'image/png', data: image.split(',')[1] } });
    }
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            databaseSchema: { type: Type.STRING },
            endpoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  method: { type: Type.STRING },
                  path: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

export const generateWeeklyResourceSummary = async (allocations: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a concise Slack-formatted weekly resource plan based on these allocations: ${JSON.stringify(allocations)}`,
    });
    return response.text;
  } catch (e) { return "Failed to generate summary."; }
};

export const generateFrontendBlueprint = async (requirement: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate React and SwiftUI frontend blueprint for: ${requirement}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            components: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            tailwindStubs: { type: Type.STRING },
            swiftUIView: { type: Type.STRING }
          }
        }
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};
