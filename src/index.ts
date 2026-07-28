import express from 'express';
import dotenv from 'dotenv';
import { CONFIG } from './config/constants.js';
import { AgentOrchestrator } from './agent/orchestrator.js';
import { createRoutes } from './api/routes.js';

dotenv.config();

const app = express();
const orchestrator = new AgentOrchestrator();

// Middleware
app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Initialize orchestrator
(async () => {
  try {
    await orchestrator.initialize();
    console.log('[Server] Orchestrator initialized');

    // API Routes
    app.use('/api', createRoutes(orchestrator));

    // Serve demo.html as static
    app.use(express.static('.'));

    // Root redirect to demo
    app.get('/', (_req, res) => {
      res.sendFile('demo.html', { root: '.' });
    });

    // Error handling
    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });

    // Start server
    const port = CONFIG.PORT;
    app.listen(port, () => {
      console.log(`[Server] Listening on http://localhost:${port}`);
      console.log(`[Server] API: http://localhost:${port}/api`);
      console.log(`[Server] Demo: http://localhost:${port}/demo.html`);
      console.log(`[Server] Environment: ${CONFIG.NODE_ENV}`);
    });
  } catch (error) {
    console.error('[Server] Failed to initialize:', error);
    process.exit(1);
  }
})();
