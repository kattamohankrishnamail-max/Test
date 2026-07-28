import { v4 as uuidv4 } from 'uuid';
import { CONFIG } from '../config/constants.js';
import type { SessionContext, ConversationMessage } from '../models/schemas.js';

export class SessionManager {
  private sessions: Map<string, SessionContext> = new Map();

  createSession(userId: string): string {
    const sessionId = uuidv4();
    const now = new Date().toISOString();

    const session: SessionContext = {
      sessionId,
      userId,
      startTime: now,
      lastActivity: now,
      conversationHistory: [],
      retrievedContext: {},
    };

    this.sessions.set(sessionId, session);
    console.log(`[SessionManager] Created session ${sessionId} for user ${userId}`);

    return sessionId;
  }

  getSession(sessionId: string): SessionContext | null {
    return this.sessions.get(sessionId) || null;
  }

  addMessage(sessionId: string, role: 'user' | 'agent', content: string, metadata?: Record<string, unknown>): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const message: ConversationMessage = {
      id: uuidv4(),
      role,
      content,
      timestamp: new Date().toISOString(),
      metadata,
    };

    session.conversationHistory.push(message);
    session.lastActivity = new Date().toISOString();

    // Keep only last N messages
    if (session.conversationHistory.length > CONFIG.MAX_CONVERSATION_HISTORY) {
      session.conversationHistory = session.conversationHistory.slice(
        -CONFIG.MAX_CONVERSATION_HISTORY,
      );
    }
  }

  getConversationHistory(sessionId: string): ConversationMessage[] {
    const session = this.sessions.get(sessionId);
    return session ? session.conversationHistory : [];
  }

  setRetrievedContext(sessionId: string, context: Record<string, unknown>): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.retrievedContext = context;
    }
  }

  getRetrievedContext(sessionId: string): Record<string, unknown> {
    const session = this.sessions.get(sessionId);
    return session ? session.retrievedContext : {};
  }

  isSessionValid(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const lastActivityTime = new Date(session.lastActivity).getTime();
    const currentTime = Date.now();
    const timeoutMs = CONFIG.SESSION_TIMEOUT_MINUTES * 60 * 1000;

    if (currentTime - lastActivityTime > timeoutMs) {
      this.deleteSession(sessionId);
      return false;
    }

    return true;
  }

  deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
    console.log(`[SessionManager] Deleted session ${sessionId}`);
  }

  getAllSessions(): SessionContext[] {
    return Array.from(this.sessions.values());
  }

  getSessionStats(sessionId: string): Record<string, unknown> {
    const session = this.sessions.get(sessionId);
    if (!session) return {};

    const startTime = new Date(session.startTime).getTime();
    const lastActivity = new Date(session.lastActivity).getTime();

    return {
      sessionId,
      userId: session.userId,
      messageCount: session.conversationHistory.length,
      duration: Math.round((lastActivity - startTime) / 1000), // seconds
      contextSize: Object.keys(session.retrievedContext).length,
    };
  }
}
