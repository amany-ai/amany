
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Project, ResourceAllocation } from "../types";

export const generateWeeklyResourceSummary = async (allocations: ResourceAllocation[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as an AI Resource Manager for a Laravel 11 & Self-Hosted MongoDB based production line. 
  Summarize the following weekly resource plan for a Slack update:
  ${JSON.stringify(allocations)}
  
  For EVERY employee, you MUST output exactly this structure:
  - Employee Name: [Value]
  - Title: [Value]
  - Project Name: [Value]
  - Task Name: [Value]
  - Start Date: [Value]
  - End Date: [Value]
  - Comment: [Value if found, otherwise "None"]
  
  Ensure to mention the local Laravel/NoSQL stack health in the summary.
  Use clean Slack-ready markdown. Add a brief executive summary at the top.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Resource Summary Error:", error);
    return "Unable to generate AI summary at this time.";
  }
};

export const generateApiBlueprint = async (requirement: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as a Senior Laravel & NoSQL Architect. Convert this requirement into a production-ready Laravel 11 & Internal MongoDB blueprint: ${requirement}.
  Output should include:
  1. Laravel REST Controllers using Moloquent (Laravel-MongoDB) & API Routes optimized for local hosting.
  2. MongoDB Document Schemas (BSON/JSON structure with local performance indexes).
  3. Swift 6.0 Model stubs for iOS Native integration.
  
  Focus on low-latency internal network performance for native mobile apps.
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
            endpoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  method: { type: Type.STRING },
                  path: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            databaseSchema: { type: Type.STRING, description: "Local MongoDB Schema" },
            swiftModels: { type: Type.STRING }
          }
        }
      }
    });
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    console.error("API Blueprint Error:", error);
    return null;
  }
};

export const analyzeFigmaDesign = async (imageData?: string, figmaLink?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let contents: any[] = [];
  if (imageData) {
    contents.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageData.split(',')[1],
      },
    });
  }
  
  const textPrompt = `Act as a Senior Laravel & NoSQL Architect. Analyze the provided ${imageData ? 'UI design mockup' : 'Figma link: ' + figmaLink}.
  1. Identify all required data entities and attributes visible in the UI.
  2. Design a Laravel 11 Controller with MongoDB Eloquent (Moloquent) to support this UI using internal node logic.
  3. Create Swift Codable Data Models for iOS Native integration.
  4. Define a Self-Hosted MongoDB (NoSQL) Document structure with appropriate collections.
  
  Return the result in JSON format.`;
  
  contents.push({ text: textPrompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: contents },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            entities: { type: Type.ARRAY, items: { type: Type.STRING } },
            endpoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  method: { type: Type.STRING },
                  path: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            databaseSchema: { type: Type.STRING, description: "Internal MongoDB structure" },
            swiftModels: { type: Type.STRING }
          },
          required: ["entities", "endpoints", "databaseSchema", "swiftModels"]
        }
      }
    });
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    console.error("Figma AI Error:", error);
    return null;
  }
};

export const estimateSalesFromBRD = async (brdContent: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as a Senior Project Estimator. 
  Analyze this BRD: ${brdContent}.
  Technical Stack: Laravel 11 Backend + Self-Hosted MongoDB + Native Mobile (Kotlin/Swift).
  Consider the 22-day production cycle and high-performance local NoSQL requirements.
  Provide an estimation in JSON format.`;

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
                },
                required: ["role", "hours"]
              }
            },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedTimelineWeeks: { type: Type.NUMBER },
            estimatedCost: { type: Type.STRING }
          },
          required: ["totalHours", "complexity", "roleBreakdown", "risks", "suggestedTimelineWeeks", "estimatedCost"]
        }
      }
    });
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    console.error("Estimation Error:", error);
    return null;
  }
};

export const orchestrateOneClickFlow = async (documentContent: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `You are the PM Orchestrator. Convert this ${documentContent.length > 500 ? 'SRS' : 'BRD'} into a full A21-Txx Zoho Project Plan.
  Tech Stack: Laravel 11 Backend + Internal MongoDB NoSQL Database.
  Document: ${documentContent}
  Target: Native Android (Kotlin), Native iOS (SwiftUI), Laravel Backend, Admin Dashboard.
  Generate roles for BA, UI, Android, iOS, Backend, and QA.
  Ensure tasks include local NoSQL schema design and Laravel API implementation.`;

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
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    console.error("Orchestration Error:", error);
    return null;
  }
};

export const getProjectInsights = async (project: Project) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze this Project Status: ${JSON.stringify(project)}.
  Environment: Laravel 11 + Self-Hosted MongoDB + Native Mobile.
  Check GitLab commit frequency in laravel-backend and native repos, Zoho task completion, and internal node integrity.`;

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
          },
          required: ["statusSummary", "riskLevel", "alerts", "recommendations"]
        }
      }
    });
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    return null;
  }
};

const CONTROL_TOOLS: FunctionDeclaration[] = [
  {
    name: 'navigate',
    parameters: {
      type: Type.OBJECT,
      properties: { tab: { type: Type.STRING } },
      required: ['tab']
    }
  }
];

export const processAICommand = async (input: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: input,
      config: { tools: [{ functionDeclarations: CONTROL_TOOLS }] }
    });
    return response.functionCalls || [];
  } catch (error) {
    return [];
  }
};

export const analyzeSRS = async (content: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `You are a Technical Architect specialized in Laravel 11 & Self-Hosted MongoDB. Analyze this Software Requirements Specification (SRS) for a 22-day production cycle:
  
  SRS Content:
  ${content}
  
  Evaluate technical feasibility for a Laravel/Internal-NoSQL stack, identify potential local MongoDB schema risks, and propose a structured task template.`;

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
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    console.error("SRS Analysis Error:", error);
    return null;
  }
};

export const generateTestSuite = async (srs: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as a Senior QA Automation Engineer. Generate automated tests for the following:
  ${srs}
  
  Stack: Laravel 11 API + Internal MongoDB + Native Mobile.
  Focus on API integrity (Pest/PHPUnit) and Mobile flows (Appium).`;

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
    return response.text ? JSON.parse(response.text) : [];
  } catch (error) {
    console.error("Test Generation Error:", error);
    return [];
  }
};
