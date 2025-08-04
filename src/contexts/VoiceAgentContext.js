import { RealtimeAgent, RealtimeSession } from "@openai/agents-realtime";
import { createContext, useContext, useEffect, useState } from "react";

const VoiceAgentContext = createContext();

export function VoiceAgentProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const createSession = (instruction = null) => {
    const agent = new RealtimeAgent({
      name: "Voice Assistant",
      instructions:
        instruction ??
        "Your task is to assist users with their queries using voice commands. Respond in a friendly and helpful manner.",
    });

    const newSession = new RealtimeSession(agent);
    setSession(newSession);
  };

  const connect = async (apiKey) => {
    try {
      if (!session) throw new Error("Session not initialized");
      await session.connect({ apiKey });
      setIsConnected(true);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const value = {
    session,
    isConnected,
    error,
    createSession,
    connect,
    disconnect: () => {
      session?.close();
      setIsConnected(false);
    },
  };

  return (
    <VoiceAgentContext.Provider value={value}>
      {children}
    </VoiceAgentContext.Provider>
  );
}

export const useVoiceAgent = () => {
  const context = useContext(VoiceAgentContext);
  if (!context) {
    throw new Error("useVoiceAgent must be used within a VoiceAgentProvider");
  }
  return context;
};
