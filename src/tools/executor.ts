import { GoogleSheetsClient } from '../integration/google-sheets-client.js';
import type { ToolResponse } from '../models/schemas.js';

export class ToolExecutor {
  constructor(private sheetsClient: GoogleSheetsClient) {}

  async execute(toolName: string, params: Record<string, unknown>): Promise<ToolResponse> {
    const startTime = Date.now();

    try {
      let data: unknown;

      switch (toolName) {
        case 'SearchCallTranscripts':
          data = await this.searchCallTranscripts(params);
          break;
        case 'SearchObjections':
          data = await this.searchObjections(params);
          break;
        case 'GetHandlingStrategy':
          data = await this.getHandlingStrategy(params);
          break;
        case 'GetSimilarCases':
          data = await this.getSimilarCases(params);
          break;
        case 'GetDealStatus':
          data = await this.getDealStatus(params);
          break;
        case 'GetCompetitorAnalysis':
          data = await this.getCompetitorAnalysis(params);
          break;
        case 'GetCaseStudies':
          data = await this.getCaseStudies(params);
          break;
        case 'GetBrandGuidelines':
          data = await this.getBrandGuidelines(params);
          break;
        case 'GetProductValueProps':
          data = await this.getProductValueProps(params);
          break;
        case 'SearchFAQ':
          data = await this.searchFAQ(params);
          break;
        case 'GetDealProgression':
          data = await this.getDealProgression(params);
          break;
        case 'LogInteraction':
          data = await this.logInteraction(params);
          break;
        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }

      return {
        toolName,
        success: true,
        data,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        toolName,
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime,
      };
    }
  }

  private async searchCallTranscripts(params: Record<string, unknown>): Promise<unknown> {
    const keyword = params.keyword as string;
    const dateRange = params.dateRange as string | undefined;
    const agentId = params.agentId as string | undefined;

    const calls = await this.sheetsClient.searchTranscripts(keyword);

    return {
      query: keyword,
      resultCount: calls.length,
      results: calls.slice(0, 5),
      filters: { dateRange, agentId },
    };
  }

  private async searchObjections(params: Record<string, unknown>): Promise<unknown> {
    const keyword = params.keyword as string;
    const category = params.category as string | undefined;

    const objections = await this.sheetsClient.getObjectionPatterns();
    const filtered = objections.filter(
      (o) =>
        o.description.toLowerCase().includes(keyword.toLowerCase()) ||
        o.type.toLowerCase().includes(keyword.toLowerCase()),
    );

    return {
      query: keyword,
      resultCount: filtered.length,
      results: filtered,
      category,
    };
  }

  private async getHandlingStrategy(params: Record<string, unknown>): Promise<unknown> {
    const objectionType = params.objectionType as string;

    const objections = await this.sheetsClient.getObjectionPatterns();
    const objection = objections.find((o) => o.type === objectionType);

    if (!objection) {
      return { error: `No strategy found for ${objectionType}` };
    }

    return {
      objectionType,
      strategy: objection.handlingStrategy,
      successRate: objection.successRate,
      commonResponses: objection.commonResponses,
      estimatedResolutionTime: objection.dataPoints.avgResolutionTime,
    };
  }

  private async getSimilarCases(params: Record<string, unknown>): Promise<unknown> {
    const objectionType = params.objectionType as string;
    const limit = (params.limit as number) || 3;

    const studies = await this.sheetsClient.getCaseStudies();
    const similar = studies.filter((s) => s.objectionType === objectionType).slice(0, limit);

    return {
      objectionType,
      caseCount: similar.length,
      cases: similar,
    };
  }

  private async getDealStatus(params: Record<string, unknown>): Promise<unknown> {
    const dealId = params.dealId as string;

    const deal = await this.sheetsClient.getDealStatus(dealId);
    if (!deal) {
      return { error: `Deal ${dealId} not found` };
    }

    return {
      ...deal,
      isActive: deal.stage !== 'closing',
      daysInStage: Math.floor(
        (Date.now() - new Date(deal.offerDate).getTime()) / (1000 * 60 * 60 * 24),
      ),
    };
  }

  private async getCompetitorAnalysis(params: Record<string, unknown>): Promise<unknown> {
    const property = params.propertyId as string;
    const neighbourhood = params.neighbourhood as string | undefined;

    const analysis = await this.sheetsClient.getCompetitorAnalysis();

    return {
      property,
      neighbourhood,
      analysis,
      lastUpdated: new Date().toISOString(),
    };
  }

  private async getCaseStudies(params: Record<string, unknown>): Promise<unknown> {
    const category = params.category as string | undefined;
    const limit = (params.limit as number) || 5;

    const studies = await this.sheetsClient.getCaseStudies();

    return {
      category,
      resultCount: studies.length,
      cases: category ? studies.filter((s) => s.objectionType === category).slice(0, limit) : studies.slice(0, limit),
    };
  }

  private async getBrandGuidelines(params: Record<string, unknown>): Promise<unknown> {
    const category = params.category as string | undefined;

    const guidelines = await this.sheetsClient.getBrandGuidelines();
    const filtered = category ? guidelines.filter((g) => (g as Record<string, unknown>).category === category) : guidelines;

    return {
      category,
      resultCount: filtered.length,
      guidelines: filtered,
    };
  }

  private async getProductValueProps(params: Record<string, unknown>): Promise<unknown> {
    const objectionType = params.objectionType as string;

    // Mock value props for real estate
    const valueProps: Record<string, unknown> = {
      'price-objections': {
        title: 'Market Value Justification',
        props: [
          'Comp analysis shows 8% below average for similar properties',
          'Premium features offset pricing: smart home, updated kitchen, solar panels',
        ],
      },
      'location-concerns': {
        title: 'Location Advantages',
        props: [
          'Top-rated schools with 9/10 average rating',
          'Under 20 minute commute to downtown employment hub',
          'New light rail station planned for 2025 (30% property value increase expected)',
        ],
      },
      'financing-questions': {
        title: 'Financing Options',
        props: [
          'Conventional loan: 6.5% rate available for qualified buyers',
          'Adjustable rate option: 5.8% for first 5 years',
          'Down payment assistance programs available for first-time buyers',
        ],
      },
    };

    return valueProps[objectionType] || { error: `No value props found for ${objectionType}` };
  }

  private async searchFAQ(params: Record<string, unknown>): Promise<unknown> {
    const query = params.query as string;

    const faqs = [
      {
        question: 'What is the average time on market?',
        answer: 'Properties in this area average 28 days on market',
      },
      {
        question: 'Are financing contingencies common?',
        answer: 'Yes, 75% of contracts include standard financing contingencies',
      },
    ];

    const results = faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(query.toLowerCase()) ||
        f.answer.toLowerCase().includes(query.toLowerCase()),
    );

    return {
      query,
      resultCount: results.length,
      results,
    };
  }

  private async getDealProgression(params: Record<string, unknown>): Promise<unknown> {
    const objectionType = params.objectionType as string;

    return {
      objectionType,
      stageProgression: {
        'lead-to-prospect': 0.85,
        'prospect-to-viewing': 0.72,
        'viewing-to-offer': 0.58,
        'offer-to-close': 0.89,
      },
      avgTimePerStage: {
        'lead-prospect': '3-5 days',
        'prospect-viewing': '1-2 weeks',
        'viewing-offer': '3-7 days',
        'offer-close': '30-45 days',
      },
    };
  }

  private async logInteraction(params: Record<string, unknown>): Promise<unknown> {
    const sessionId = params.sessionId as string;
    const query = params.query as string;
    const response = params.response as string;
    const toolsUsed = params.toolsUsed as string[];
    const userFeedback = params.userFeedback as string | undefined;

    // In production, save to database
    return {
      success: true,
      logId: `LOG-${Date.now()}`,
      sessionId,
      timestamp: new Date().toISOString(),
      toolsUsed: toolsUsed.length,
      feedback: userFeedback || 'pending',
    };
  }
}
