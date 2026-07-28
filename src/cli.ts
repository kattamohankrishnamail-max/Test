import * as readline from 'readline';
import { AgentOrchestrator } from './agent/orchestrator.js';
import { ResponseFormatter } from './response/formatter.js';

const orchestrator = new AgentOrchestrator();
const formatter = new ResponseFormatter();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  await orchestrator.initialize();

  console.log('\n' + '='.repeat(60));
  console.log('Real Estate Sales Objection Agent - CLI');
  console.log('='.repeat(60));
  console.log('\nWelcome! I help you handle sales objections with data-driven strategies.');
  console.log('Type "exit" to quit, "sessions" to see active sessions, "clear" to start fresh.\n');

  let sessionId: string | undefined;

  const askQuestion = () => {
    rl.question('You: ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log('\nGoodbye!');
        rl.close();
        return;
      }

      if (input.toLowerCase() === 'sessions') {
        const sessions = orchestrator.getAllSessions();
        console.log(`\nActive sessions: ${sessions.length}`);
        sessions.forEach((s) => {
          const stats = orchestrator.getSessionStats(s.sessionId);
          console.log(`  - ${s.sessionId}: ${stats.messageCount} messages, ${stats.duration}s duration`);
        });
        console.log();
        askQuestion();
        return;
      }

      if (input.toLowerCase() === 'clear') {
        sessionId = undefined;
        console.log('\nSession cleared. Starting fresh.\n');
        askQuestion();
        return;
      }

      if (input.trim() === '') {
        askQuestion();
        return;
      }

      try {
        const response = await orchestrator.processQuery('user-001', input, sessionId);
        sessionId = response.sessionId;

        console.log(formatter.formatForCLI(response));
      } catch (error) {
        console.error('\nError:', error instanceof Error ? error.message : 'Unknown error');
        console.log();
      }

      askQuestion();
    });
  };

  askQuestion();
}

main().catch(console.error);
