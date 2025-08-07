import { useContext, useEffect, useState, useRef } from "react";
import { useVoiceAgent } from "../contexts/VoiceAgentContext";
import { Button } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import MicVisualizer from "../components/MicVisualizer";
import { AudioLines, Bot, Mic, MicVocal, Volume2 } from "lucide-react";
import {
  submitRequest,
  neshanSearch,
  searchSubject,
} from "../services/ai_tools_function";
import { aiFunctionsEndpoints, voiceAgentEndpoints } from "../utils/apis";
import { z } from "zod";

const VoiceAgentConversation = () => {
  const [instruction, setInstruction] = useState(null);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("ready");
  const [audioBlob, setAudioBlob] = useState(null);

  const audioPlayerRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);

  const { createSession, isConnected, error, connect, session, disconnect } =
    useVoiceAgent();

  useEffect(() => {
    const fetchInstruction = async () => {
      const res = await voiceAgentEndpoints.getVoiceAgentInstruction();

      setInstruction(res.instruction);
    };

    const fetchToolFunctions = async () => {
      const res = await aiFunctionsEndpoints.getFunctionsMap();

      const tools = [submitRequest, neshanSearch, searchSubject];

      setTools(tools);
    };

    fetchInstruction();

    fetchToolFunctions();
  }, []);

  // Track if session has already been created to avoid endless loop
  const [sessionCreated, setSessionCreated] = useState(false);

  useEffect(() => {
    // Only create session if instruction is not null and tools is an array (can be empty)
    if (!sessionCreated && instruction && Array.isArray(tools)) {
      createSession(instruction, tools);
      setSessionCreated(true);
    }
  }, [instruction, tools, sessionCreated, createSession]);

  useEffect(() => {
    if (error) {
      console.error("VoiceAgentConversation error:", error);
      alert("An error occurred: " + error);
    }
  }, [error]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }
      const audioContext = audioContextRef.current;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const arrayBuffer = await event.data.arrayBuffer();
          try {
            await session?.sendAudio(arrayBuffer);
          } catch (err) {
            console.error("Failed to send audio:", err);
          }
        }
      };

      mediaRecorderRef.current.start(100);
      setMode("recording");
    } catch (err) {
      console.error("Error starting recording:", err);
      setMode("ready");
    }
  };

  useEffect(() => {
    if (!session) return;

    const handleAudio = (event) => {
      const blob = new Blob([event.audioData], { type: "audio/mp3" });
      setAudioBlob(blob);
      setMode("playing");
    };

    session.on("audio", handleAudio);

    return () => {
      session.off("audio", handleAudio);
    };
  }, [session]);

  useEffect(() => {
    if (mode !== "playing" || !audioBlob) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;

    analyserRef.current = audioContext.createAnalyser();
    analyserRef.current.fftSize = 2048;

    audioPlayerRef.current = new Audio(URL.createObjectURL(audioBlob));
    const source = audioContext.createMediaElementSource(
      audioPlayerRef.current
    );
    source.connect(analyserRef.current);
    analyserRef.current.connect(audioContext.destination);

    audioPlayerRef.current.onended = () => {
      setMode("ready");
      setAudioBlob(null);
    };

    audioPlayerRef.current.play().catch(console.error);

    return () => {
      audioPlayerRef.current?.pause();
      audioPlayerRef.current?.removeEventListener("ended", () => {});
    };
  }, [mode, audioBlob]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const data = await voiceAgentEndpoints.getClientSecretKey(
        process.env.REACT_APP_VOICE_MODEL
      );
      await connect(data.value);
      startRecording();
    } catch (err) {
      console.error("Error connecting to voice agent:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }

    disconnect();
    setMode("ready");
    setAudioBlob(null);
  };

  if (!isConnected) {
    return (
      <div className="container items-center h-screen flex justify-center">
        <div className="grid justify-center align-center gap-4">
          <AudioLines className="mx-auto" size={200} color="#898989" />
          <p className="text-gray-500">
            با ربات هوش مصنوعی به صورت صوتی گفتگو کنید
          </p>
          <Button
            className="bg-blue-600 text-white my-5 h-10 flex items-center justify-center w-auto justify-self-center"
            onClick={handleConnect}
            disabled={isConnected || loading}
          >
            {!isConnected && loading ? (
              <ClipLoader color="white" size={15} />
            ) : (
              <>
                <span className="mx-2">شروع گفتگو</span>
                <MicVocal />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center h-screen items-center gap-4 p-4">
      <MicVisualizer analyser={analyserRef.current}>
        <Mic size={24} color={mode === "recording" ? "red" : "gray"} />
      </MicVisualizer>

      <Button
        variant="danger"
        onClick={handleDisconnect}
        className="mt-4 dark:text-white"
      >
        Disconnect
      </Button>
    </div>
  );
};

export default VoiceAgentConversation;
