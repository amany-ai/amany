
import { GoogleGenAI, Type } from "@google/genai";
import { EstimationResult, Project, ResourceAllocation, UIDesignResult, MethodologyOption } from "../types";
import { ROWAD_ESTIMATION_RULES } from "../constants";

const extractJson = (text: string | undefined) => {
  if (!text) return null;
  try {
    return JSON.parse(text.trim());
  } catch (e) {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');
    let jsonStr = '';
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      if (firstBracket === -1 || (firstBrace < firstBracket && lastBrace > lastBracket)) {
        jsonStr = text.substring(firstBrace, lastBrace + 1);
      } else if (firstBracket !== -1 && lastBracket !== -1) {
        jsonStr = text.substring(firstBracket, lastBracket + 1);
      }
    } else if (firstBracket !== -1 && lastBracket !== -1) {
      jsonStr = text.substring(firstBracket, lastBracket + 1);
    }
    
    if (!jsonStr) return null;
    try {
      return JSON.parse(jsonStr);
    } catch (innerE) {
      return null;
    }
  }
};

/**
 * AGENT 1: ZOHO SYNC PROMPT (LARAVEL ALIGNED + WEBHOOK PERSISTENCE)
 */
export const buildZohoSyncPrompt = (rawApiResponse: any) => {
  return `
    PURPOSE: Transform raw Zoho Projects JSON/Webhook data into Sovereign Laravel-ready schema.
    STACK: Laravel 11 + MongoDB (Moloquent).
    ENDPOINT: zpsrF3qTxKfnMFD4mGt2o0pyi5bYPvFEzsiDHx8YEFH4rqiV9BzzyUOoxn9RXFFL8ZxrATyf03AwR
    INPUT SCHEMA: Zoho Webhook Payload or REST API Output.
    OUTPUT SCHEMA: 
    {
      "sync_status": "success",
      "delta_counts": { "new_tasks": number, "updated_tasks": number },
      "tasks": [
        { "id": string, "name": string, "owner_email": string, "status": "OPEN"|"DONE" }
      ]
    }
    RULES:
    1. Extract task ID for MongoDB upsert using the specific webhook handshake.
    2. Normalize all data for PHP 8.2 compatibility.
    3. prioritize webhook data as real-time source of truth.
  `;
};

/**
 * AGENT 2: TIME DOCTOR SYNC PROMPT (HR COMPLIANCE)
 */
export const buildTimeDoctorSyncPrompt = (timeEntries: any) => {
  return `
    PURPOSE: Aggregate Time Doctor logs for HR Compliance monitoring via Laravel backend.
    INPUT SCHEMA: Time Doctor entries list.
    OUTPUT SCHEMA:
    {
      "compliance_summary": [
         { "email": string, "total_hours": float, "idle_percentage": float, "violations": string[] }
      ],
      "identity_handshake": { "gaps": number, "orphan_emails": string[] }
    }
    RULES:
    1. Flag idle percentages above 25% for HR Agent review.
  `;
};

/**
 * PLANNER MESH AGENTS
 */

export const runAgent1ZohoSync = async (zohoData: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = buildZohoSyncPrompt(zohoData);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: JSON.stringify(zohoData),
      config: { systemInstruction, responseMimeType: 'application/json' }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

export const runAgent3WeeklyPlanner = async (context: { tasks: any[], capacity: number }) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    You are Agent 3 (Weekly Resource Planner). 
    STACK: Laravel 11 Backend + Moloquent Node.
    LAWS:
    1. Focus EXCLUSIVELY on Zoho Projects workload data (REST + Webhook zpsrF3...).
    2. Max capacity = 40h/week per resource node.
    3. Reserve 10% for support.
    4. Prioritize tasks due in < 14 days.
    OUTPUT: JSON { allocations: array, overcapacity: array, risk_flags: array }
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: JSON.stringify(context),
      config: { systemInstruction, responseMimeType: 'application/json' }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

export const runAgent6Audit = async (outputs: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    You are Agent 6 (Audit & Review). 
    TASK: Validate consistency across Laravel sync (Webhook zpsrF3...) and MongoDB nodes.
    LAWS: No unassigned high-priority tasks, no math errors in cost nodes.
    OUTPUT: JSON { audit_status: "pass"|"fail", violations: array, fixes: array }
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: JSON.stringify(outputs),
      config: { systemInstruction, responseMimeType: 'application/json' }
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
        systemInstruction: "persona: workflow health agent. focus on zoho progress nodes via Laravel 11 API (Webhook zpsrF3... integration). output: { \"statusSummary\": string, \"alerts\": string[] } in JSON.",
        responseMimeType: 'application/json'
      }
    });
    return extractJson(response.text);
  } catch (e) { return { statusSummary: "monitoring idle", alerts: [] }; }
};

export const runInitialScan = async (input: string, files: any[] = []): Promise<{ scope: any, methodology_options: MethodologyOption[] } | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    You are Agent A (Scope Extractor) and Agent B (Methodology Selector).
    Context: Laravel 11 + MongoDB production stack with Zoho Webhook zpsrF3...
    Output JSON only.
  `;
  const parts = [{ text: input }];
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: { systemInstruction, responseMimeType: 'application/json' }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

export const runFullSynthesis = async (params: any): Promise<EstimationResult | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    You are the Rowaad Estimator Mesh Orchestrator. 
    Design estimations specifically for a PHP 8.2 / Laravel 11 / MongoDB architecture using Zoho Webhook zpsrF3...
    Output JSON only.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: JSON.stringify(params),
      config: { systemInstruction, responseMimeType: 'application/json' }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
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
        systemInstruction: "you are the command orchestrator agent for the Laravel 11 ecosystem (Webhook zpsrF3... enabled).",
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
        systemInstruction: "persona: senior technical auditor agent. Analyze against Laravel 11 best practices. output JSON.",
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
        systemInstruction: "persona: QA automation engineer. focus on Laravel API and Native mobile flows. output JSON array.",
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
        systemInstruction: "persona: backend architect. generate Laravel 11 PHP models and controllers with Moloquent syntax. output JSON.",
        responseMimeType: 'application/json'
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

export const analyzeFigmaDesign = async (image?: string, link?: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const parts: any[] = [{ text: `Analyze this Figma design for a Laravel 11/Swift ecosystem. ${link || ''}` }];
  if (image) {
    parts.push({ inlineData: { mimeType: 'image/png', data: image.split(',')[1] || image } });
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        systemInstruction: "persona: UI/UX engineer. Provide Laravel API route suggestions and Swift view stubs in JSON.",
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
      config: { systemInstruction: "summarize this resource plan for the week based on zoho workload via Laravel node (Webhook zpsrF3...)." }
    });
    return response.text || "";
  } catch (e) { return ""; }
};

export const generateFrontendBlueprint = async (requirement: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: requirement,
      config: {
        systemInstruction: "persona: frontend lead. generate components and Tailwind stubs for a Laravel-served API node. output JSON.",
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
        systemInstruction: "persona: master UI designer. generate design specs for the Inter-based Sovereign OS. output JSON.",
        responseMimeType: 'application/json'
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};
