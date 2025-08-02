import { useEffect, useState } from "react";
import { voiceAgentEndpoints } from "../utils/apis";

const VoiceAgentConversation = () => {
  const [instruction, setInstruction] = useState(null);

  useEffect(() => {
    const fetchInstruction = async () => {
      const res = await voiceAgentEndpoints.getVoiceAgentInstruction();

      setInstruction(res.instruction);
    };

    fetchInstruction();
  }, []);

  return (
    <div dir="ltr" className="p-5">
      <h1>Voice Agent Conversation Page ✌️✌️🙌🙌</h1>

      <h3>Instruction</h3>

      <br />

      <pre dir="ltr">{instruction}</pre>
    </div>
  );
};

export default VoiceAgentConversation;
