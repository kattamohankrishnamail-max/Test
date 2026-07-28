export interface PropertyListing {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType: string;
  agentId: string;
  listDate: string;
  status: 'active' | 'pending' | 'sold';
}

export interface SalesCall {
  id: string;
  agentId: string;
  clientName: string;
  propertyId: string;
  duration: number;
  date: string;
  transcript: string;
  remarks: string;
  objectionType: string;
  resolved: boolean;
}

export interface Objection {
  id: string;
  type: string;
  description: string;
  category: string;
  handlingStrategy: string;
  successRate: number;
  commonResponses: string[];
  dataPoints: Record<string, unknown>;
}

export interface DealStatus {
  id: string;
  propertyId: string;
  clientId: string;
  stage: string;
  objections: string[];
  purchasePrice: number;
  offerDate: string;
  expectedCloseDate: string;
  agentNotes: string;
}

export interface CaseStudy {
  id: string;
  propertyAddress: string;
  clientCompany?: string;
  objectionType: string;
  resolution: string;
  outcome: string;
  metrics: Record<string, unknown>;
  lessonLearned: string;
}

export interface BrandGuideline {
  id: string;
  category: string;
  rule: string;
  examples: string[];
  doNots: string[];
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface SessionContext {
  sessionId: string;
  userId: string;
  startTime: string;
  lastActivity: string;
  conversationHistory: ConversationMessage[];
  retrievedContext: Record<string, unknown>;
}

export interface ToolResponse {
  toolName: string;
  success: boolean;
  data: unknown;
  error?: string;
  executionTime: number;
}

export interface AgentResponse {
  sessionId: string;
  content: string;
  confidence: number;
  dataFreshness: string;
  citedSources: string[];
  metadata: {
    toolsUsed: string[];
    executionTime: number;
    cacheHit: boolean;
    stage: string;
  };
}

export interface RetrievalContext {
  intent: string;
  domain: string;
  callTranscripts: SalesCall[];
  objectionPatterns: Objection[];
  similarCases: CaseStudy[];
  dealContext: DealStatus[];
  brandContext: BrandGuideline[];
  competitorAnalysis: Record<string, unknown>;
}

export interface InteractionLog {
  id: string;
  sessionId: string;
  query: string;
  response: string;
  confidence: number;
  duration: number;
  toolsUsed: string[];
  userFeedback?: 'helpful' | 'not-helpful' | 'partial';
  timestamp: string;
}
