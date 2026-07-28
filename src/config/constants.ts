export const CONFIG = {
  // API
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',

  // Google Sheets
  GOOGLE_SHEETS_SPREADSHEET_ID: process.env.SPREADSHEET_ID || '',
  GOOGLE_SHEETS_PRIVATE_KEY: process.env.GOOGLE_SHEETS_PRIVATE_KEY || '',
  GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL || '',
  GOOGLE_SHEETS_PROJECT_ID: process.env.GOOGLE_SHEETS_PROJECT_ID || '',

  // Server
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Session Management
  SESSION_TIMEOUT_MINUTES: parseInt(process.env.SESSION_TIMEOUT_MINUTES || '30', 10),
  MAX_CONVERSATION_HISTORY: parseInt(process.env.MAX_CONVERSATION_HISTORY || '10', 10),

  // Claude API
  CLAUDE_MODEL: 'claude-3-5-sonnet-20241022',
  CLAUDE_MAX_TOKENS: 2048,
};

export const REAL_ESTATE_DOMAINS = [
  'price-objections',
  'location-concerns',
  'financing-questions',
  'property-condition',
  'market-conditions',
  'timing-concerns',
  'competition',
  'contract-terms',
  'contingencies',
  'inspection-issues',
];

export const REAL_ESTATE_FUNNEL_STAGES = [
  'lead',
  'prospect',
  'viewing-scheduled',
  'offer-phase',
  'negotiation',
  'inspection',
  'appraisal',
  'closing',
];

export const REAL_ESTATE_PROPERTY_TYPES = [
  'residential-single-family',
  'residential-multi-family',
  'commercial-office',
  'commercial-retail',
  'industrial',
  'land',
];

export const TOOLS_DEFINITIONS = [
  'SearchCallTranscripts',
  'SearchObjections',
  'GetHandlingStrategy',
  'GetSimilarCases',
  'GetDealStatus',
  'GetCompetitorAnalysis',
  'GetCaseStudies',
  'GetBrandGuidelines',
  'GetProductValueProps',
  'SearchFAQ',
  'GetDealProgression',
  'LogInteraction',
];
