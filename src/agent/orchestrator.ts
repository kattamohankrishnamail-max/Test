import Anthropic from '@anthropic-ai/sdk';
import { CONFIG } from '../config/constants.js';
import { GoogleSheetsClient } from '../integration/google-sheets-client.js';
import { ToolExecutor } from '../tools/executor.js';
import { RetrievalPipeline } from '../retrieval/multi-stage-pipeline.js';
import { SessionManager } from '../memory/session-manager.js';
import { ResponseFormatter } from '../response/formatter.js';
import type { AgentResponse } from '../models/schemas.js';

export class AgentOrchestrator {
  private client: Anthropic;
  private sheetsClient: GoogleSheetsClient;
  private toolExecutor: ToolExecutor;
  private retrievalPipeline: RetrievalPipeline;
  private sessionManager: SessionManager;
  private formatter: ResponseFormatter;

  constructor() {
    this.client = new Anthropic({
      apiKey: CONFIG.ANTHROPIC_API_KEY,
    });

    this.sheetsClient = new GoogleSheetsClient();
    this.toolExecutor = new ToolExecutor(this.sheetsClient);
    this.retrievalPipeline = new RetrievalPipeline(this.toolExecutor);
    this.sessionManager = new SessionManager();
    this.formatter = new ResponseFormatter();
  }

  async initialize(): Promise<void> {
    await this.sheetsClient.initialize();
    console.log('AgentOrchestrator initialized');
  }

  async processQuery(userId: string, query: string, sessionId?: string): Promise<AgentResponse> {
    const startTime = Date.now();

    // Session Management (Stage 1)
    const actualSessionId = sessionId || this.sessionManager.createSession(userId);
    console.log(`\n[Orchestrator] Processing query for session ${actualSessionId}`);
    console.log(`[Orchestrator] Query: "${query}"`);

    // Add user message to conversation history
    this.sessionManager.addMessage(actualSessionId, 'user', query);

    // Multi-Domain Retrieval (Stage 2-5)
    console.log('[Orchestrator] Starting retrieval pipeline...');
    const retrievalContext = await this.retrievalPipeline.execute(query);
    this.sessionManager.setRetrievedContext(actualSessionId, retrievalContext);

    // Prompt Construction (Stage 6)
    const systemPrompt = this.buildSystemPrompt(retrievalContext);
    const userPrompt = this.buildUserPrompt(query, retrievalContext);

    console.log('[Orchestrator] Sending to Claude API...');

    // LLM Invocation (Stage 7)
    const response = await this.client.messages.create({
      model: CONFIG.CLAUDE_MODEL,
      max_tokens: CONFIG.CLAUDE_MAX_TOKENS,
      system: systemPrompt,
      messages: [
        ...this.sessionManager.getConversationHistory(actualSessionId).map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
      ],
    });

    const assistantContent =
      response.content[0].type === 'text' ? response.content[0].text : 'Unable to process response';

    // Response Enhancement (Stage 8)
    const agentResponse = this.formatter.formatAgentResponse(
      actualSessionId,
      assistantContent,
      retrievalContext,
      Date.now() - startTime,
      this.retrievalPipeline.constructor.name ? ['RetrievalPipeline'] : [],
    );

    // Add agent message to conversation history
    this.sessionManager.addMessage(actualSessionId, 'agent', assistantContent);

    // Logging (Stage 9)
    await this.logInteraction(actualSessionId, query, assistantContent);

    console.log(`[Orchestrator] Response generated in ${Date.now() - startTime}ms`);

    return agentResponse;
  }

  private buildSystemPrompt(context: any): string {
    return `You are an expert real estate sales agent assistant. Your role is to help sales professionals handle customer objections with data-driven strategies and proven approaches.

You have access to:
1. Previous sales call transcripts and remarks
2. Objection handling strategies with success rates
3. Relevant case studies and market analysis
4. Brand guidelines for professional communication
5. Financing options and value propositions

When responding to questions about sales objections:
- Lead with data-backed strategies proven to work in similar situations
- Provide specific examples from case studies
- Include success rates and average resolution times
- Suggest specific talking points and responses
- Explain the psychology behind why the strategy works
- Recommend next steps for the sales process

Always maintain a professional, confidence-building tone aligned with brand guidelines.
Format your response with clear sections: Strategy, Supporting Evidence, Sample Response, Next Steps.`;
  }

  private buildUserPrompt(query: string, context: any): string {
    let prompt = query + '\n\n';

    if (context.objectionPatterns && context.objectionPatterns.length > 0) {
      prompt += '### Relevant Objection Patterns:\n';
      context.objectionPatterns.forEach((obj: any) => {
        prompt += `- ${obj.type}: ${obj.handlingStrategy} (${Math.round(obj.successRate * 100)}% success rate)\n`;
      });
      prompt += '\n';
    }

    if (context.similarCases && context.similarCases.length > 0) {
      prompt += '### Similar Case Studies:\n';
      context.similarCases.forEach((caseStudy: any) => {
        prompt += `- ${caseStudy.propertyAddress}: ${caseStudy.resolution}\n`;
      });
      prompt += '\n';
    }

    if (context.callTranscripts && context.callTranscripts.length > 0) {
      prompt += `### Relevant Historical Approaches:\n`;
      prompt += `Found ${context.callTranscripts.length} similar calls in our records.\n\n`;
    }

    return prompt;
  }

  private async logInteraction(sessionId: string, query: string, response: string): Promise<void> {
    const session = this.sessionManager.getSession(sessionId);
    if (!session) return;

    await this.toolExecutor.execute('LogInteraction', {
      sessionId,
      query,
      response,
      toolsUsed: ['RetrievalPipeline', 'ToolExecutor'],
      userFeedback: 'pending',
    });
  }

  getSession(sessionId: string) {
    return this.sessionManager.getSession(sessionId);
  }

  getAllSessions() {
    return this.sessionManager.getAllSessions();
  }

  getSessionStats(sessionId: string) {
    return this.sessionManager.getSessionStats(sessionId);
  }
}
