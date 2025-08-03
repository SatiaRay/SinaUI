import { useContext, useEffect, useState } from "react";
import { voiceAgentEndpoints } from "../utils/apis";
import { useVoiceAgent } from "../contexts/VoiceAgentContext";
import { Button } from "react-bootstrap";

const VoiceAgentConversation = () => {
  const [instruction, setInstruction] = useState(null);

  const { createSession, session, isConnected, error, connect, disconnect } =
    useVoiceAgent();

  useEffect(() => {
    const fetchInstruction = async () => {
      const res = await voiceAgentEndpoints.getVoiceAgentInstruction();

      setInstruction(res.instruction);

      createSession(res.instruction);
    };

    fetchInstruction();
  }, []);

  useEffect(() => {
    if (error) {
      console.error("VoiceAgentConversation error:", error);

      alert("An error occurred: " + error);
    }
  }, [error]);

  const handleConnect = async () => {
    const data = await voiceAgentEndpoints.getClientSecretKey(
      "gpt-4o-realtime-preview-2025-06-03"
    );

    if (data.value) {
      connect(data.value);
    }
  };

  return (
    <div dir="ltr" className="p-5">
      <h1>Voice Agent Conversation Page ✌️✌️🙌🙌</h1>

      <h3>Instruction</h3>

      <Button
        className="bg-blue-600 text-white my-5 mx-0"
        onClick={handleConnect}
        disabled={isConnected}
      >
        {isConnected ? "Disconnect" : "Connect"}
      </Button>

      <br />

      <pre dir="ltr">{instruction}</pre>
    </div>
  );
};

export default VoiceAgentConversation;
