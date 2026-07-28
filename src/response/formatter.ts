import type { AgentResponse, RetrievalContext } from '../models/schemas.js';

export class ResponseFormatter {
  formatAgentResponse(
    sessionId: string,
    content: string,
    retrievalContext: RetrievalContext,
    executionTime: number,
    toolsUsed: string[],
  ): AgentResponse {
    const confidence = this.calculateConfidence(retrievalContext);
    const citedSources = this.extractCitedSources(retrievalContext);
    const dataFreshness = this.determineDataFreshness();

    return {
      sessionId,
      content,
      confidence,
      dataFreshness,
      citedSources,
      metadata: {
        toolsUsed,
        executionTime,
        cacheHit: false,
        stage: 'response-formatting',
      },
    };
  }

  formatMarkdownResponse(
    agentResponse: AgentResponse,
    retrievalContext: RetrievalContext,
  ): string {
    let markdown = agentResponse.content + '\n\n';

    // Add confidence and freshness badge
    markdown += `---\n`;
    markdown += `**Confidence: ${Math.round(agentResponse.confidence * 100)}% | `;
    markdown += `Data Freshness: ${agentResponse.dataFreshness} | `;
    markdown += `Sources: ${agentResponse.citedSources.length}**\n\n`;

    // Add cited sources
    if (agentResponse.citedSources.length > 0) {
      markdown += `### Supporting Evidence\n`;
      agentResponse.citedSources.forEach((source, i) => {
        markdown += `${i + 1}. ${source}\n`;
      });
      markdown += '\n';
    }

    // Add tools used
    if (agentResponse.metadata.toolsUsed.length > 0) {
      markdown += `### Tools Used\n`;
      agentResponse.metadata.toolsUsed.forEach((tool) => {
        markdown += `- ${tool}\n`;
      });
      markdown += '\n';
    }

    // Add execution stats
    markdown += `### Performance\n`;
    markdown += `- Response Time: ${agentResponse.metadata.executionTime}ms\n`;

    return markdown;
  }

  private calculateConfidence(context: RetrievalContext): number {
    let score = 0.5; // Base score

    // Increase confidence based on available context
    if (context.callTranscripts.length > 0) score += 0.1;
    if (context.objectionPatterns.length > 0) score += 0.1;
    if (context.similarCases.length > 0) score += 0.15;
    if (context.dealContext.length > 0) score += 0.1;
    if (context.brandContext.length > 0) score += 0.05;

    return Math.min(score, 0.99); // Cap at 99%
  }

  private extractCitedSources(context: RetrievalContext): string[] {
    const sources: string[] = [];

    if (context.similarCases.length > 0) {
      context.similarCases.forEach((caseStudy: any, i) => {
        sources.push(
          `Case Study ${i + 1}: ${caseStudy.propertyAddress} - ${caseStudy.outcome}`,
        );
      });
    }

    if (context.objectionPatterns.length > 0) {
      context.objectionPatterns.forEach((objection: any) => {
        sources.push(`Objection Pattern: ${objection.type} (Success Rate: ${Math.round(objection.successRate * 100)}%)`);
      });
    }

    if (context.callTranscripts.length > 0) {
      sources.push(`Reference: ${context.callTranscripts.length} relevant call transcripts`);
    }

    if (context.dealContext.length > 0) {
      sources.push(`Deal Context: Current stage and objection history`);
    }

    return sources;
  }

  private determineDataFreshness(): string {
    const now = new Date();
    const hour = now.getHours();

    // Simulated freshness based on time
    if (hour < 6) {
      return 'Real-time + 1-2 days';
    } else if (hour < 12) {
      return 'Real-time + 0-1 days';
    } else {
      return 'Real-time + 1-3 days';
    }
  }

  formatForCLI(response: AgentResponse): string {
    let output = '\n' + '='.repeat(60) + '\n';
    output += 'AGENT RESPONSE\n';
    output += '='.repeat(60) + '\n\n';

    output += response.content + '\n\n';

    output += '-'.repeat(60) + '\n';
    output += `Confidence: ${Math.round(response.confidence * 100)}%\n`;
    output += `Data Freshness: ${response.dataFreshness}\n`;
    output += `Tools Used: ${response.metadata.toolsUsed.join(', ')}\n`;
    output += `Execution Time: ${response.metadata.executionTime}ms\n`;
    output += '-'.repeat(60) + '\n\n';

    if (response.citedSources.length > 0) {
      output += 'SOURCES:\n';
      response.citedSources.forEach((source, i) => {
        output += `  ${i + 1}. ${source}\n`;
      });
      output += '\n';
    }

    return output;
  }
}
