
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Project, ResourceAllocation } from "../types";

const extractJson = (text: string | undefined) => {
  if (!text) return null;
  try {
    // Attempt direct parse first
    return JSON.parse(text);
  } catch (e) {
    // If it fails, try to find a JSON block in markdown
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (innerE) {
        console.error("JSON Extraction failed", innerE);
        return null;
      }
    }
    return null;
  }
};

export const generateWeeklyResourceSummary = async (allocations: ResourceAllocation[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as an AI Resource Manager for a React & Native Mobile production line. 
  Summarize the following weekly resource plan for a Slack update.
  
  Resources:
  ${JSON.stringify(allocations)}
  
  For EVERY employee, you MUST output exactly this structure:
  - Employee Name: [Value]
  - Title: [Value]
  - Project Name: [Value]
  - Task Name: [Value]
  - Start Date: [Value]
  - End Date: [Value]
  - Comment: [Value if found, otherwise "None"]
  
  Use clean Slack-ready markdown. Add a brief executive summary at the top.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Unable to generate AI summary at this time.";
  } catch (error) {
    console.error("Resource Summary Error:", error);
    return "Unable to generate AI summary at this time.";
  }
};

export const generateFrontendBlueprint = async (requirement: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as a Senior Lead Frontend Architect. Convert this requirement into a production-ready React component structure and SwiftUI stubs.
  Requirement: ${requirement}.
  
  Output should include:
  1. React/Tailwind component hierarchy.
  2. State management logic (React Context/Redux).
  3. Swift 6.0 SwiftUI view stubs for Native integration.
  
  Return as a clean JSON object.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
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
                  description: { type: Type.STRING },
                  props: { type: Type.ARRAY, items: { type: Type.STRING } }
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
  } catch (error) {
    console.error("Frontend Blueprint Error:", error);
    return null;
  }
};

export const processAICommand = async (input: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const CONTROL_TOOLS: FunctionDeclaration[] = [
    {
      name: 'navigate',
      description: 'Navigate to a different tab or section of the application.',
      parameters: {
        type: Type.OBJECT,
        properties: { 
          tab: { 
            type: Type.STRING, 
            description: 'The ID of the tab to navigate to (dashboard, tasks, frontend, system-files, vault, testcenter, notifications, users, srs, blueprint, resources, employees, policy).' 
          } 
        },
        required: ['tab']
      }
    }
  ];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: input,
      config: { 
        tools: [{ functionDeclarations: CONTROL_TOOLS }],
        systemInstruction: "You are the Rowaad PM-Auto assistant. Help users navigate the system. If they want to see a section, use the navigate tool."
      }
    });
    return response.functionCalls || [];
  } catch (error) {
    console.error("AI Command Error:", error);
    return [];
  }
};

export const analyzeSRS = async (content: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze this Software Requirements Specification (SRS) for a 22-day production cycle.
  
  SRS Content:
  ${content}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            timelineFeasibility: { type: Type.STRING },
            suggestedTasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  phase: { type: Type.STRING },
                  durationHours: { type: Type.NUMBER },
                  priority: { type: Type.STRING }
                },
                required: ["title", "phase", "durationHours", "priority"]
              }
            }
          },
          required: ["summary", "risks", "timelineFeasibility", "suggestedTasks"]
        }
      }
    });
    return extractJson(response.text);
  } catch (error) {
    console.error("SRS Analysis Error:", error);
    return null;
  }
};

export const generateTestSuite = async (srs: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as a Senior QA Automation Engineer. Generate automated tests for: ${srs}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              type: { type: Type.STRING },
              priority: { type: Type.STRING },
              platform: { type: Type.STRING },
              automationScript: { type: Type.STRING }
            },
            required: ["id", "title", "type", "priority", "platform", "automationScript"]
          }
        }
      }
    });
    return extractJson(response.text) || [];
  } catch (error) {
    console.error("Test Generation Error:", error);
    return [];
  }
};

export const orchestrateOneClickFlow = async (documentContent: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Convert this SRS into a full A21 project plan for React & Native Mobile.
  Document: ${documentContent}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectName: { type: Type.STRING },
            planSummary: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  zohoId: { type: Type.STRING },
                  title: { type: Type.STRING },
                  role: { type: Type.STRING },
                  durationDays: { type: Type.NUMBER },
                  priority: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return extractJson(response.text);
  } catch (error) {
    console.error("Orchestration Error:", error);
    return null;
  }
};

export const estimateSalesFromBRD = async (brdContent: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as a Senior Project Estimator for a React/Native stack.
  BRD: ${brdContent}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalHours: { type: Type.NUMBER },
            complexity: { type: Type.STRING },
            roleBreakdown: { 
              type: Type.ARRAY, 
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  hours: { type: Type.NUMBER }
                }
              }
            },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedTimelineWeeks: { type: Type.NUMBER },
            estimatedCost: { type: Type.STRING }
          }
        }
      }
    });
    return extractJson(response.text);
  } catch (error) {
    console.error("Estimation Error:", error);
    return null;
  }
};

export const getProjectInsights = async (project: Project) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze this Project Status: ${JSON.stringify(project)}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            statusSummary: { type: Type.STRING },
            riskLevel: { type: Type.STRING },
            alerts: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return extractJson(response.text);
  } catch (error) {
    return null;
  }
};

// Fixed: Added missing generateApiBlueprint export for BackendDev component
export const generateApiBlueprint = async (requirement: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as a Senior Backend Architect for Laravel 11 and MongoDB.
  Convert this requirement into a backend blueprint: ${requirement}.
  
  Output MUST include:
  1. databaseSchema: A BSON/MongoDB collection schema.
  2. endpoints: An array of objects with 'method' and 'path'.
  
  Return as a clean JSON object.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
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
                },
                required: ["method", "path"]
              }
            }
          },
          required: ["databaseSchema", "endpoints"]
        }
      }
    });
    return extractJson(response.text);
  } catch (error) {
    console.error("API Blueprint Error:", error);
    return null;
  }
};

// Fixed: Added missing analyzeFigmaDesign export for BackendDev component
export const analyzeFigmaDesign = async (figmaImage?: string, figmaLink?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let parts: any[] = [{ text: `Act as a UI/UX and Backend Architect. Analyze this Figma design and generate a Laravel + MongoDB architecture blueprint.
  
  Output MUST include:
  1. databaseSchema: A BSON/MongoDB collection schema.
  2. endpoints: An array of objects with 'method' and 'path'.
  
  Return as a clean JSON object.` }];

  if (figmaImage) {
    parts.push({
      inlineData: {
        mimeType: 'image/png',
        data: figmaImage.split(',')[1] || figmaImage,
      },
    });
  }
  
  if (figmaLink) {
    parts.push({ text: `Figma Link: ${figmaLink}` });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // High quality analysis model for design to code task
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
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
                },
                required: ["method", "path"]
              }
            }
          },
          required: ["databaseSchema", "endpoints"]
        }
      }
    });
    return extractJson(response.text);
  } catch (error) {
    console.error("Figma Sync Error:", error);
    return null;
  }
};
