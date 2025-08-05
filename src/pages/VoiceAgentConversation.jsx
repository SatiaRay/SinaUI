import { useContext, useEffect, useState } from "react";
import { aiFunctionsEndpoints, voiceAgentEndpoints } from "../utils/apis";
import { useVoiceAgent } from "../contexts/VoiceAgentContext";
import { Button } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { submitRequest, neshanSearch } from "../services/ai_tools_function";
import { tool } from "@openai/agents/realtime";
import { z } from "zod";

const VoiceAgentConversation = () => {
  const [instruction, setInstruction] = useState(null);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);

  const { createSession, session, isConnected, error, connect, disconnect } =
    useVoiceAgent();

  useEffect(() => {
    const fetchInstruction = async () => {
      const res = await voiceAgentEndpoints.getVoiceAgentInstruction();

      setInstruction(res.instruction);
    };

    const fetchToolFunctions = async () => {
      const res = await aiFunctionsEndpoints.getFunctionsMap();

      const tools = [submitRequest, neshanSearch];

      // res.functions.map((functionObject) => {
      //   let parameters = Object.keys(functionObject.parameters.properties);

      //   parameters = parameters.reduce((acc, key) => {
      //     acc[key] = undefined; // or set a default value (e.g., null, "")
      //     return acc;
      //   }, {});

      //   let paramShape = {};
      //   Object.entries(functionObject.parameters.properties).forEach(
      //     ([key, value]) => {
      //       if (typeof z[value.type] === "function") {
      //         paramShape[key] = z[value.type]();
      //       } else {
      //         // fallback to z.any() if type is not recognized
      //         paramShape[key] = z.any();
      //       }
      //     }
      //   );

      //   paramShape = z.object(paramShape);

      //   tools.push(
      //     tool({
      //       name: functionObject.name,
      //       description: functionObject.description,
      //       parameters: paramShape,
      //       async execute(parameters) {
      //         console.log(`Calling function: ${functionObject.name}`);

      //         console.log(parameters);

      //         return await aiFunctionsEndpoints.callFunction(
      //           functionObject.name,
      //           parameters
      //         );
      //       },
      //     })
      //   );
      // });

      setTools(tools);
    };

    fetchInstruction();

    fetchToolFunctions();
  }, []);

  useEffect(() => {
    if ((tools, instruction)) {
      console.log("SESSION CREATED");

      console.log(tools[4]);

      createSession(instruction, tools);
    }
  }, [instruction, tools]);

  useEffect(() => {
    if (error) {
      console.error("VoiceAgentConversation error:", error);

      alert("An error occurred: " + error);
    }
  }, [error]);

  const handleConnect = async () => {
    setLoading(true);

    try {
      const data = await voiceAgentEndpoints.getClientSecretKey(
        "gpt-4o-realtime-preview-2024-12-17"
      );

      connect(data.value);
    } catch (err) {
      console.error("Error connecting to voice agent:", err);
    } finally {
      setLoading(false);
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
        {!isConnected && loading ? (
          <ClipLoader color="white" size={15} />
        ) : isConnected ? (
          "Disconnect"
        ) : (
          "Connect"
        )}
      </Button>
      <br />

      <pre dir="ltr">{instruction}</pre>
    </div>
  );
};

export default VoiceAgentConversation;
