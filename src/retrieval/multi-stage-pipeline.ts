import { ToolExecutor } from '../tools/executor.js';
import type { RetrievalContext } from '../models/schemas.js';

export class RetrievalPipeline {
  constructor(private toolExecutor: ToolExecutor) {}

  async execute(query: string): Promise<RetrievalContext> {
    console.log(`[RetrievalPipeline] Starting 5-stage pipeline for: ${query}`);

    // Stage 1: Intent Classification
    const intent = await this.classifyIntent(query);
    console.log(`[Stage 1] Intent: ${intent.type}, Domain: ${intent.domain}`);

    // Stage 2: Structured Retrieval (parallel branches)
    const [callTranscripts, objectionPatterns, dealContext] = await Promise.all([
      this.retrieveCallTranscripts(query),
      this.retrieveObjectionPatterns(intent),
      this.retrieveDealContext(query),
    ]);

    console.log('[Stage 2] Structured retrieval complete');

    // Stage 3: Semantic Context Matching
    const { similarCases, brandContext } = await this.semanticMatching(intent, objectionPatterns);
    console.log('[Stage 3] Semantic matching complete');

    // Stage 4: Cross-Domain Enrichment
    const { competitorAnalysis } = await this.crossDomainEnrichment(intent);
    console.log('[Stage 4] Cross-domain enrichment complete');

    // Stage 5: Context Assembly
    const context: RetrievalContext = {
      intent: intent.type,
      domain: intent.domain,
      callTranscripts,
      objectionPatterns,
      similarCases,
      dealContext,
      brandContext,
      competitorAnalysis,
    };

    console.log('[Stage 5] Context assembly complete');
    return context;
  }

  private async classifyIntent(query: string): Promise<{ type: string; domain: string }> {
    // Simple keyword-based classification for MVP
    const queryLower = query.toLowerCase();

    if (queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('afford')) {
      return { type: 'price-objection', domain: 'pricing' };
    }

    if (queryLower.includes('location') || queryLower.includes('neighbourhood') || queryLower.includes('area')) {
      return { type: 'location-objection', domain: 'location' };
    }

    if (queryLower.includes('financing') || queryLower.includes('mortgage') || queryLower.includes('loan')) {
      return { type: 'financing-objection', domain: 'financial' };
    }

    if (queryLower.includes('similar') || queryLower.includes('comparison') || queryLower.includes('comp')) {
      return { type: 'comparison-query', domain: 'market-analysis' };
    }

    return { type: 'general-query', domain: 'general' };
  }

  private async retrieveCallTranscripts(query: string): Promise<any[]> {
    const result = await this.toolExecutor.execute('SearchCallTranscripts', {
      keyword: query,
    });

    return result.success ? ((result.data as Record<string, unknown>).results as any[]) : [];
  }

  private async retrieveObjectionPatterns(intent: { type: string; domain: string }): Promise<any[]> {
    const result = await this.toolExecutor.execute('SearchObjections', {
      category: intent.domain,
    });

    return result.success ? ((result.data as Record<string, unknown>).results as any[]) : [];
  }

  private async retrieveDealContext(query: string): Promise<any[]> {
    // Extract deal ID from query if present, otherwise return general funnel data
    const dealIdMatch = query.match(/DEAL-\d+/);

    if (dealIdMatch) {
      const result = await this.toolExecutor.execute('GetDealStatus', {
        dealId: dealIdMatch[0],
      });

      return result.success ? [result.data] : [];
    }

    return [];
  }

  private async semanticMatching(
    intent: { type: string; domain: string },
    objections: any[],
  ): Promise<{ similarCases: any[]; brandContext: any[] }> {
    const objectionType =
      objections.length > 0
        ? (objections[0] as Record<string, unknown>).type
        : intent.type.replace('-objection', '');

    const [casesResult, brandResult] = await Promise.all([
      this.toolExecutor.execute('GetSimilarCases', {
        objectionType,
        limit: 3,
      }),
      this.toolExecutor.execute('GetBrandGuidelines', {
        category: 'tone',
      }),
    ]);

    return {
      similarCases: casesResult.success ? ((casesResult.data as Record<string, unknown>).cases as any[]) : [],
      brandContext: brandResult.success ? ((brandResult.data as Record<string, unknown>).guidelines as any[]) : [],
    };
  }

  private async crossDomainEnrichment(intent: { type: string; domain: string }): Promise<{ competitorAnalysis: any }> {
    const result = await this.toolExecutor.execute('GetCompetitorAnalysis', {
      neighbourhood: intent.domain,
    });

    return {
      competitorAnalysis: result.success ? result.data : {},
    };
  }
}
