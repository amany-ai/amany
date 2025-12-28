
import { GoogleGenAI, Type } from "@google/genai";
import { EstimationResult, Project, ResourceAllocation, UIDesignResult, MethodologyOption } from "../types";

const extractJson = (text: string | undefined) => {
  if (!text) return null;
  try {
    // Attempt direct parse first as we are using responseMimeType: 'application/json'
    return JSON.parse(text.trim());
  } catch (e) {
    // Fallback for wrapped responses
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      try {
        return JSON.parse(text.substring(firstBrace, lastBrace + 1));
      } catch (inner) {
        return null;
      }
    }
    return null;
  }
};

/**
 * Helper to convert local file objects to Gemini inlineData parts
 */
const filesToParts = (files: any[]) => {
  return files.map(file => {
    if (file.url && file.url.includes('base64,')) {
      return {
        inlineData: {
          mimeType: file.type || 'image/png',
          data: file.url.split('base64,')[1]
        }
      };
    }
    return { text: `File Content (${file.name}): ${file.url}` };
  });
};

export const runInitialScan = async (input: string, files: any[] = []): Promise<{ scope: any, methodology_options: MethodologyOption[] } | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const fileParts = filesToParts(files);
  const contents = { 
    parts: [
      { text: `Analyze these requirements for a Node.js/Atlas project: ${input}` },
      ...fileParts
    ] 
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents,
      config: { 
        systemInstruction: "You are Agent A (Scope Extractor). Extract the technical scope and suggest 3 methodology options. Output valid JSON.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scope: {
              type: Type.OBJECT,
              properties: {
                project_name: { type: Type.STRING },
                domain: { type: Type.STRING },
                platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
                core_modules: { type: Type.ARRAY, items: { type: Type.STRING } },
                complexity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
              },
              required: ['project_name', 'complexity']
            },
            methodology_options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  justification: { type: Type.STRING },
                  pros: { type: Type.STRING },
                  cons: { type: Type.STRING }
                }
              }
            }
          },
          required: ['scope', 'methodology_options']
        }
      }
    });
    return extractJson(response.text);
  } catch (e) { 
    console.error("Initial Scan Failed:", e);
    return null; 
  }
};

export const runFullSynthesis = async (params: any): Promise<EstimationResult | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const fileParts = filesToParts(params.files || []);
  const contents = { 
    parts: [
      { text: `Synthesize full estimation for ${params.scope.project_name} using ${params.methodology} methodology. Base input: ${params.input}` },
      ...fileParts
    ] 
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents,
      config: { 
        systemInstruction: "Rowaad Estimator Orchestrator. Stack: Node.js/PostgreSQL/Atlas. Use 22-day rules for effort. Output valid JSON matching the EstimationResult schema.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scope: { type: Type.OBJECT, properties: { complexity: { type: Type.STRING }, project_name: { type: Type.STRING } } },
            effort_days: {
              type: Type.OBJECT,
              properties: {
                backend: { type: Type.NUMBER },
                dashboard: { type: Type.NUMBER },
                website: { type: Type.NUMBER },
                android: { type: Type.NUMBER },
                ios: { type: Type.NUMBER },
                qa: { type: Type.NUMBER },
                deployment: { type: Type.NUMBER },
                integrations: { type: Type.NUMBER }
              }
            },
            duration_working_days: { type: Type.NUMBER },
            team: { type: Type.OBJECT, properties: { BA: { type: Type.NUMBER }, Backend: { type: Type.NUMBER }, Frontend: { type: Type.NUMBER }, Android: { type: Type.NUMBER }, iOS: { type: Type.NUMBER }, QA: { type: Type.NUMBER }, PM: { type: Type.NUMBER } } },
            rates_monthly: { type: Type.OBJECT },
            budget: {
              type: Type.OBJECT,
              properties: {
                monthly_cost: { type: Type.NUMBER },
                project_cost: { type: Type.NUMBER },
                vat_amount: { type: Type.NUMBER },
                total_with_vat: { type: Type.NUMBER }
              }
            },
            integrations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { vendor: { type: Type.STRING }, effort_days: { type: Type.NUMBER }, complexity: { type: Type.STRING } } } },
            validation: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING, enum: ['pass', 'fail'] },
                issues: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { rule: { type: Type.STRING }, impact: { type: Type.STRING }, fix_steps: { type: Type.ARRAY, items: { type: Type.STRING } } } } }
              }
            },
            assumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
            export_plan: { type: Type.OBJECT, properties: { code_snippet: { type: Type.STRING } } },
            human_summary: { type: Type.STRING }
          },
          required: ['effort_days', 'duration_working_days', 'budget', 'validation']
        }
      }
    });
    return extractJson(response.text);
  } catch (e) { 
    console.error("Synthesis Failed:", e);
    return null; 
  }
};

export const runAgent1ZohoSync = async (zohoData: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: JSON.stringify(zohoData),
      config: { 
        systemInstruction: "Transform Zoho data to Node.js/Atlas schema. Output JSON.",
        responseMimeType: 'application/json'
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

export const getProjectHealthInsights = async (project: Project): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: JSON.stringify(project),
      config: { 
        systemInstruction: "Persona: workflow health agent. Focus on Node.js/Atlas nodes. output: { \"statusSummary\": string, \"alerts\": string[] } in JSON.",
        responseMimeType: 'application/json'
      }
    });
    return extractJson(response.text);
  } catch (e) { return { statusSummary: "monitoring idle", alerts: [] }; }
};

export const processCommandAgent = async (input: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const navigateFunction = {
    name: 'navigate',
    parameters: {
      type: Type.OBJECT,
      properties: { tab: { type: Type.STRING } },
      required: ['tab'],
    },
  };
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: input,
      config: {
        systemInstruction: "You are the command orchestrator for a Node.js/Atlas internal project management hub.",
        tools: [{ functionDeclarations: [navigateFunction] }]
      }
    });
    return response.functionCalls || [];
  } catch (e) { return []; }
};

export const estimateSalesFromBRD = async (brd: string, config: { isPremiumWeb: boolean }): Promise<EstimationResult | null> => {
  const initial = await runInitialScan(brd);
  if (!initial) return null;
  return runFullSynthesis({ 
    input: brd, 
    scope: initial.scope, 
    methodology: 'Agile Iterations',
    use22DayLogic: !config.isPremiumWeb 
  });
};

export const analyzeSRS = async (content: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: content,
      config: { 
        systemInstruction: "Persona: senior technical auditor. Analyze against Node.js/Atlas standards. Output JSON.",
        responseMimeType: 'application/json'
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

export const generateTestSuite = async (srs: string): Promise<any[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: srs,
      config: {
        systemInstruction: "Persona: QA automation engineer. focus on Node.js API and Native mobile. output JSON array.",
        responseMimeType: 'application/json'
      }
    });
    return extractJson(response.text) || [];
  } catch (e) { return []; }
};

export const generateApiBlueprint = async (requirement: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: requirement,
      config: {
        systemInstruction: "Persona: backend architect. generate Node.js/Express controllers and Mongoose schemas for Atlas. output JSON.",
        responseMimeType: 'application/json'
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

export const generateFrontendBlueprint = async (requirement: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: requirement,
      config: {
        systemInstruction: "Persona: frontend lead. generate components and Tailwind stubs for a Node-served API. output JSON.",
        responseMimeType: 'application/json'
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

export const generateUIDesign = async (prompt: string): Promise<UIDesignResult | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Persona: master UI designer. generate design specs for the Inter-based Sovereign OS. output JSON.",
        responseMimeType: 'application/json'
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

export const analyzeFigmaDesign = async (image?: string, link?: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const parts: any[] = [{ text: `Analyze this Figma design for a Node.js/Atlas ecosystem. ${link || ''}` }];
  if (image) {
    parts.push({ inlineData: { mimeType: 'image/png', data: image.split(',')[1] || image } });
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        systemInstruction: "Persona: UI/UX engineer. Provide Node.js API route suggestions and Swift view stubs in JSON.",
        responseMimeType: 'application/json'
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

export const generateWeeklyResourceSummary = async (allocations: any[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: JSON.stringify(allocations),
      config: { systemInstruction: "Summarize resource plan for Node.js/Atlas workload." }
    });
    return response.text || "";
  } catch (e) { return ""; }
};
