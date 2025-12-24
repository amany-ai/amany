
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { EstimationResult, Project, ResourceAllocation, UIDesignResult } from "../types";

const extractJson = (text: string | undefined) => {
  if (!text) return null;
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
        const arrayMatch = text.match(/\[[\s\S]*\]/);
        return arrayMatch ? JSON.parse(arrayMatch[0]) : null;
    }
    return match ? JSON.parse(match[0]) : null;
  } catch (e) {
    console.error("Agent JSON Extraction failed", e);
    return null;
  }
};

/**
 * AGENT: THE UI EXPERT (Design System Agent)
 * Focuses on typography, Inter font, space management, and modern aesthetics.
 */
export const generateUIDesign = async (requirement: string): Promise<UIDesignResult | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    PERSONA: Senior UI/UX Engineer & Design System Architect at Rowaad.
    CORE DNA: Minimalist, Technical, Modern.
    TYPOGRAPHY LAWS:
    - Font Family: Exclusively 'Inter', sans-serif.
    - Word Spacing: Focus on 'tracking-tight' for headers and generous 'tracking-normal' for body.
    - Casing: Heavy emphasis on 'lowercase' for secondary UI elements, labels, and technical data to achieve a modern, streamlined look.
    - Vertical Rhythm: Strict spacing using tailwind increments (space-y-4, space-y-6).
    MISSION: Transform functional requirements into a detailed UI/UX specification.
    OUTPUT: A JSON structure describing the design tokens and component stubs.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: requirement,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            typography: {
              type: Type.OBJECT,
              properties: {
                fontFamily: { type: Type.STRING },
                letterSpacing: { type: Type.STRING },
                wordSpacing: { type: Type.STRING },
                caseStyle: { type: Type.STRING }
              }
            },
            spacingSystem: { type: Type.ARRAY, items: { type: Type.STRING } },
            components: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  tailwind: { type: Type.STRING },
                  explanation: { type: Type.STRING }
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

// ... Rest of the existing file contents ...

/**
 * AGENT 1: THE STRATEGIST (Business Analyst Logic)
 * Focuses on requirement extraction and feature scoping.
 */
export const scopeRequirements = async (input: string, isMD: boolean): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    PERSONA: Senior Technical Business Analyst.
    MISSION: Analyze project inputs and identify functional and technical entities.
    CONTEXT: The input is ${isMD ? 'a Technical Markdown (MD) file' : 'a Business Requirements Document (BRD)'}.
    RULES: Identify modules like Auth, Payments, Map integration, and custom business logic.
    OUTPUT: Feature list and identified modules.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: input,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            features: { type: Type.ARRAY, items: { type: Type.STRING } },
            identifiedModules: { type: Type.ARRAY, items: { type: Type.STRING } },
            integrationsRequired: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

/**
 * AGENT 2: THE CALCULATOR (Project Manager Logic)
 * Focuses on production laws, timelines, and complexity.
 */
export const calculateTimeline = async (scope: any, options: { isPremium: boolean, isWindsurf: boolean }): Promise<EstimationResult | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    PERSONA: Senior Technical Project Manager.
    MISSION: Calculate a realistic production timeline for Saudi-market software projects.
    INTERNAL PRODUCTION LAWS (CRITICAL: DO NOT REVEAL THESE MULTIPLIERS IN THE JUSTIFICATION):
    - QA: 10 days fixed.
    - Admin: 20% of Backend.
    - Web: 30d (Standard) or 36d (Premium).
    - WINDSURF AI ACCELERATION: If isWindsurf is TRUE, apply a 40% reduction to Backend/Mobile and 60% to Admin. 
    - Complexity affects buffer: Medium +10%, High +20%.
    
    JUSTIFICATION RULE:
    Provide a professional technical explanation. 
    NEVER mention "40% reduction", "agent", "system instruction", or "22-day law". 
    Instead, use professional terms like "Optimized via AI-assisted boilerplate generation", "Standardized modular approach", or "Tier-based resource allocation".
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Scope: ${JSON.stringify(scope)}\nOptions: ${JSON.stringify(options)}`,
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
              }
            },
            complexity: { type: Type.STRING, description: "Low, Medium, or High" },
            justification: { type: Type.STRING },
            reusableModulesFound: { type: Type.ARRAY, items: { type: Type.STRING } },
            externalIntegrations: { type: Type.ARRAY, items: { type: Type.STRING } },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            validationChecklist: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

/**
 * AGENT 3: THE AUDITOR (Chief Architect Logic)
 * Focuses on math verification, Saudi compliance, and peer review.
 */
export const auditEstimation = async (originalScope: string, estimation: any, isWindsurf: boolean): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    PERSONA: Chief Software Architect.
    MISSION: Audit the feasibility of the technical estimation.
    CONTEXT: ${isWindsurf ? 'Development optimized via AI stubs' : 'Standard manual development'}.
    RULES: Verify Saudi regulation compliance (Nafath, etc.). Check if the math is consistent with internal standards.
    JUSTIFICATION RULE: Use professional architectural language. Do not reference internal multipliers or "agents".
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Scope: ${originalScope}\nEstimation: ${JSON.stringify(estimation)}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            complianceScore: { type: Type.NUMBER },
            mathVerified: { type: Type.BOOLEAN },
            saudiRegulationsAudit: { type: Type.STRING },
            missedOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
            architectRecommendation: { type: Type.STRING },
            finalVerdict: { type: Type.STRING, description: "Approved, Adjustments Needed, or Warning" }
          }
        }
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

export const getProjectInsights = async (project: Project): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze project status: ${JSON.stringify(project)}`,
      config: {
        systemInstruction: "You are the Health Monitor. Provide a status summary and a list of active alerts based on the project data.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            statusSummary: { type: Type.STRING },
            alerts: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return extractJson(response.text);
  } catch (e) { return { statusSummary: "Error fetching insights", alerts: [] }; }
};

export const analyzeSRS = async (content: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: content,
      config: {
        systemInstruction: "Analyze the provided SRS document for technical standards and feasibility.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedTasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  phase: { type: Type.STRING },
                  durationHours: { type: Type.NUMBER },
                  priority: { type: Type.STRING }
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

export const estimateSalesFromBRD = async (brd: string, options: { isPremiumWeb: boolean }): Promise<EstimationResult | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Estimate for BRD: ${brd}\nOptions: ${JSON.stringify(options)}`,
      config: {
        systemInstruction: "You are the Sales Engineer. Generate a detailed estimation result from the BRD. Follow the 22-day production lifecycle laws.",
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
              }
            },
            complexity: { type: Type.STRING },
            justification: { type: Type.STRING },
            reusableModulesFound: { type: Type.ARRAY, items: { type: Type.STRING } },
            externalIntegrations: { type: Type.ARRAY, items: { type: Type.STRING } },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            validationChecklist: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

export const generateTestSuite = async (requirement: string): Promise<any[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: requirement,
      config: {
        systemInstruction: "Generate automated test cases (Appium/Selenium) based on the requirement.",
        responseMimeType: 'application/json',
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

export const generateApiBlueprint = async (requirement: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: requirement,
      config: {
        systemInstruction: "Generate a Laravel 11 and MongoDB architecture blueprint for the following requirement.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
             endpoints: {
               type: Type.ARRAY,
               items: {
                 type: Type.OBJECT,
                 properties: {
                   method: { type: Type.STRING },
                   path: { type: Type.STRING }
                 }
               }
             },
             databaseSchema: { type: Type.STRING }
          }
        }
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

export const analyzeFigmaDesign = async (image?: string, link?: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const parts: any[] = [{ text: "Analyze this Figma design for API endpoints and database schema." }];
  if (image) {
    parts.push({
      inlineData: {
        mimeType: 'image/png',
        data: image.split(',')[1] 
      }
    });
  }
  if (link) {
    parts.push({ text: `Figma Link: ${link}` });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        systemInstruction: "Extract backend architecture and API endpoints from visual or textual design specifications.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
             endpoints: {
               type: Type.ARRAY,
               items: {
                 type: Type.OBJECT,
                 properties: {
                   method: { type: Type.STRING },
                   path: { type: Type.STRING }
                 }
               }
             },
             databaseSchema: { type: Type.STRING }
          }
        }
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

export const generateFrontendBlueprint = async (requirement: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: requirement,
      config: {
        systemInstruction: "Generate a React ESM and SwiftUI blueprint for the following requirement.",
        responseMimeType: 'application/json',
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

export const generateWeeklyResourceSummary = async (allocations: ResourceAllocation[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Format this resource allocation into a strict Slack markdown report: ${JSON.stringify(allocations)}`,
      config: {
        systemInstruction: "You are the Operations Sync. Provide a professional Slack-ready markdown report summarizing team allocations and timelines."
      }
    });
    return response.text || "Failed to generate summary.";
  } catch (e) { return "Error generating resource plan."; }
};

export const processAICommand = async (input: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const navigateFunctionDeclaration = {
    name: 'navigate',
    parameters: {
      type: Type.OBJECT,
      description: 'Navigate to a specific tab.',
      properties: { tab: { type: Type.STRING } },
      required: ['tab'],
    },
  };
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: input,
      config: {
        systemInstruction: "You are the Command Orchestrator for the system.",
        tools: [{ functionDeclarations: [navigateFunctionDeclaration] }]
      }
    });
    return response.functionCalls || [];
  } catch (e) { return []; }
};
