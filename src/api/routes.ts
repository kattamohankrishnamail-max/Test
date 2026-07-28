import express from 'express';
import type { Request, Response } from 'express';
import { AgentOrchestrator } from '../agent/orchestrator.js';

export function createRoutes(orchestrator: AgentOrchestrator): express.Router {
  const router = express.Router();

  // Health check
  router.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Process a user query
  router.post('/query', async (req: Request, res: Response) => {
    try {
      const { userId, query, sessionId } = req.body;

      if (!userId || !query) {
        return res.status(400).json({
          error: 'Missing required fields: userId, query',
        });
      }

      const response = await orchestrator.processQuery(userId, query, sessionId);

      res.json({
        success: true,
        sessionId: response.sessionId,
        response: response.content,
        confidence: response.confidence,
        dataFreshness: response.dataFreshness,
        sources: response.citedSources,
        metadata: response.metadata,
      });
    } catch (error) {
      console.error('Error processing query:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  });

  // Get session info
  router.get('/session/:sessionId', (req: Request, res: Response) => {
    const session = orchestrator.getSession(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const stats = orchestrator.getSessionStats(req.params.sessionId);

    res.json({
      session,
      stats,
    });
  });

  // Get all sessions (admin)
  router.get('/sessions', (req: Request, res: Response) => {
    const sessions = orchestrator.getAllSessions();

    res.json({
      total: sessions.length,
      sessions: sessions.map((s) => ({
        sessionId: s.sessionId,
        userId: s.userId,
        messageCount: s.conversationHistory.length,
        stats: orchestrator.getSessionStats(s.sessionId),
      })),
    });
  });

  // Example queries for testing
  router.get('/examples', (req: Request, res: Response) => {
    res.json({
      examples: [
        {
          id: 'ex-001',
          query: 'How do I handle price objections in high-value properties?',
          description: 'Pricing strategy for premium real estate',
        },
        {
          id: 'ex-002',
          query: 'What are the best approaches to location concerns?',
          description: 'Addressing neighborhood and location objections',
        },
        {
          id: 'ex-003',
          query: 'Show me similar deals where we resolved financing questions',
          description: 'Case study examples for financing objections',
        },
        {
          id: 'ex-004',
          query: 'Compare this property to competitors in the area',
          description: 'Competitive market analysis',
        },
        {
          id: 'ex-005',
          query: 'What should I say when a client asks about the property condition?',
          description: 'Handling property condition concerns',
        },
      ],
    });
  });

  return router;
}
