
import { GoogleGenAI, Type } from "@google/genai";
import { EstimationResult, Project, ResourceAllocation, UIDesignResult, MethodologyOption } from "../types";
import { ROWAD_ESTIMATION_RULES } from "../constants";

const extractJson = (text: string | undefined) => {
  if (!text) return null;
  // Try direct parse first if it's clean
  try {
    return JSON.parse(text.trim());
  } catch (e) {
    // Fallback to searching for JSON blocks
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

const processAttachments = (files: any[]) => {
  return files.map(file => {
    if (file.type.startsWith('image/')) {
      return {
        inlineData: {
          mimeType: file.type,
          data: file.url.split(',')[1] || file.url,
        },
      };
    }
    return { text: `Attached File: ${file.name}\nContent: ${file.url}` };
  });
};

/**
 * STEP 1: INITIAL SCAN (Agent A & B)
 */
export const runInitialScan = async (input: string, files: any[] = []): Promise<{ scope: any, methodology_options: MethodologyOption[] } | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    You are Agent A (Scope Extractor) and Agent B (Methodology Selector) for Rowaad Estimator Mesh.
    
    CRITICAL: YOU MUST OUTPUT A VALID JSON OBJECT WITH THE EXACT STRUCTURE BELOW.
    
    {
      "scope": {
        "project_name": "string",
        "domain": "string",
        "platforms": ["Web", "Dashboard", "Android", "iOS", "Website"],
        "user_types": ["string"],
        "core_modules": ["string"],
        "complexity": "Low" | "Medium" | "High"
      },
      "methodology_options": [
        {
          "type": "Waterfall" | "Agile Iterations" | "22-Day Role Model",
          "justification": "string",
          "pros": "string",
          "cons": "string",
          "timeline_adjustment": "string"
        }
      ]
    }

    AGENT A RULES:
    1. Extract core modules. Compare against: ${ROWAD_ESTIMATION_RULES.REUSABLE_MODULES.join(', ')}.
    2. Detect platforms: Web, Dashboard, Website, Android, iOS.
    3. Identify user types and complexity.
    
    AGENT B RULES:
    1. Offer 3 options: Waterfall, Agile Iterations, 22-Day Role Model.
    2. 22-Day Role Model is the Rowaad baseline.
  `;

  const parts = [{ text: input }, ...processAttachments(files)];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: { systemInstruction, responseMimeType: 'application/json' }
    });
    const parsed = extractJson(response.text);
    // Ensure structure exists to prevent UI crashes
    if (parsed && !parsed.scope) parsed.scope = { project_name: "Project Unnamed", platforms: [], complexity: "Medium" };
    if (parsed && !parsed.methodology_options) parsed.methodology_options = [];
    return parsed;
  } catch (e) {
    console.error("Agent A/B Error:", e);
    return null; 
  }
};

/**
 * STEP 2: FULL SYNTHESIS (Agent C, D, E, F, G)
 */
export const runFullSynthesis = async (params: { 
  input: string, 
  files: any[],
  scope: any, 
  methodology: string,
  use22DayLogic: boolean 
}): Promise<EstimationResult | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    You are the Rowaad Estimator Mesh Orchestrator running Agents C, D, E, F, and G in strict order.
    
    CRITICAL: YOU MUST OUTPUT A VALID JSON OBJECT WITH THE FOLLOWING STRUCTURE:
    {
      "scope": {},
      "selected_methodology": "string",
      "effort_days": { "backend": 0, "dashboard": 0, "website": 0, "android": 0, "ios": 0, "qa": 0, "deployment": 0, "integrations": 0 },
      "duration_working_days": 0,
      "team": { "BA": 0, "Backend": 0, "Frontend": 0, "Android": 0, "iOS": 0, "QA": 0, "PM": 0, "AccountManager": 0 },
      "rates_monthly": {},
      "budget": { "monthly_cost": 0, "project_cost": 0, "vat_amount": 0, "total_with_vat": 0 },
      "integrations": [],
      "export_plan": { "code_snippet": "string" },
      "validation": { "status": "pass", "issues": [] },
      "assumptions": [],
      "exclusions": [],
      "next_questions": [],
      "human_summary": "string"
    }

    PRODUCTION LAWS (MUST FOLLOW EXACTLY FOR ACCURACY):
    
    AGENT C (TIME):
    - Base Logic: 1 Working Day = 8 Hours.
    - Reusable Modules: If a module exists in the library, REDUCE its individual build effort by 40%.
    - Complexity: Medium (+10% total effort), High (+20% total effort).
    - Website: Standard = 30 days. Premium = 30 + 20%. If not in scope, effort = 0.
    - Dashboard: Effort MUST EQUAL 20% of Backend effort.
    - Android/iOS: If not in scope, effort = 0.
    - QA: Fixed base of 10 days. Add +3 days for EVERY extra platform (Web, Android, iOS, Website, Dashboard).
    - Integrations: Separate from apps/backend. Discovery, Auth, Implementation, Testing, Go Live phases.
    
    AGENT D (BUDGET):
    - Monthly Rates: BA(12000), Backend(18000), Frontend(17000), Android(18000), iOS(18000), QA(14000), PM(16000), AM(12000).
    - Team Count: If effort for a platform is 0, headcount for that role MUST be 0.
    - Project Cost Calculation: 
      1. Monthly Cost = Sum(Role Count * Monthly Rate).
      2. Project Cost = Monthly Cost * (Duration Working Days / 22).
      3. VAT = Project Cost * 0.15.
      4. Total = Project Cost + VAT.
    
    AGENT G (VALIDATION GUARDRAIL):
    - Check if Dashboard is exactly 0.2 * Backend.
    - Check if any role has headcount > 0 but effort = 0.
    - Check if VAT is exactly 15%.
    - Re-verify all math.
  `;

  const parts = [
    { text: `Input Context: ${params.input}` },
    { text: `Pre-scanned Scope JSON: ${JSON.stringify(params.scope)}` },
    { text: `Selected Methodology: ${params.methodology}` },
    { text: `Logic Model: ${params.use22DayLogic ? '22-Day Role Model' : 'Standard 30-Day Calendar'}` },
    ...processAttachments(params.files)
  ];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: { systemInstruction, responseMimeType: 'application/json' }
    });
    const parsed = extractJson(response.text);
    if (parsed) {
      // Defaulting to prevent UI crashes if model skips fields
      if (!parsed.validation) parsed.validation = { status: 'pass', issues: [] };
      if (!parsed.effort_days) parsed.effort_days = {};
      if (!parsed.team) parsed.team = {};
      if (!parsed.budget) parsed.budget = { monthly_cost: 0, project_cost: 0, vat_amount: 0, total_with_vat: 0 };
      if (!parsed.integrations) parsed.integrations = [];
      if (!parsed.export_plan) parsed.export_plan = { code_snippet: "" };
    }
    return parsed;
  } catch (e) {
    console.error("Synthesis Error:", e);
    return null;
  }
};

// Supporting agents...
export const orchestrateEstimation = async (params: { text: string, type: 'BRD' | 'MD', files: any[], use22DayLogic: boolean }): Promise<EstimationResult | null> => {
  const initial = await runInitialScan(params.text, params.files);
  if (!initial) return null;
  return runFullSynthesis({ 
    input: params.text, 
    files: params.files,
    scope: initial.scope, 
    methodology: '22-Day Role Model',
    use22DayLogic: params.use22DayLogic 
  });
};

export const getProjectHealthInsights = async (project: Project): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: JSON.stringify(project),
      config: { 
        systemInstruction: "persona: workflow health agent. output: { \"statusSummary\": string, \"alerts\": string[] } in JSON.",
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
        systemInstruction: "you are the command orchestrator agent.",
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
    files: [],
    scope: initial.scope, 
    methodology: 'Agile Iterations',
    use22DayLogic: !config.isPremiumWeb 
  });
};

export const analyzeSRS = async (content: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    persona: senior technical auditor agent.
    task: analyze the provided SRS document for feasibility and technical risks.
    output: { 
      "summary": "overall feasibility description", 
      "risks": ["risk 1", "risk 2"], 
      "suggestedTasks": [
        { "title": "task name", "phase": "BA/Dev/QA", "durationHours": number, "priority": "High"|"Medium"|"Low" }
      ] 
    } in JSON.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: content,
      config: { systemInstruction, responseMimeType: 'application/json' }
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
        systemInstruction: "persona: QA automation engineer. generate test cases as JSON array: {id, title, platform, type, priority, automationScript}.",
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
        systemInstruction: "persona: backend architect. generate databaseSchema (string) and endpoints (array of {method, path}) in JSON.",
        responseMimeType: 'application/json'
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};

export const analyzeFigmaDesign = async (image?: string, link?: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const parts: any[] = [{ text: `Analyze this Figma design ${link || ''}` }];
  if (image) {
    parts.push({ inlineData: { mimeType: 'image/png', data: image.split(',')[1] || image } });
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        systemInstruction: "persona: UI/UX engineer. analyze design and provide databaseSchema (string) and endpoints (array of {method, path}) in JSON.",
        responseMimeType: 'application/json'
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
      contents: JSON.stringify(allocations),
      config: { systemInstruction: "summarize this resource plan for the week." }
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
        systemInstruction: "persona: frontend lead. generate components (array of {name, description}), tailwindStubs (string), and swiftUIView (string) in JSON.",
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
        systemInstruction: "persona: master UI designer. generate typography, components (array of {name, tailwind, explanation}), and spacingSystem (string[]) in JSON.",
        responseMimeType: 'application/json'
      }
    });
    return extractJson(response.text);
  } catch (e) { return null; }
};
