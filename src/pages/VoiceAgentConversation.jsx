import { useEffect, useState, useRef } from "react";
import { voiceAgentEndpoints } from "../utils/apis";
import { useVoiceAgent } from "../contexts/VoiceAgentContext";
import { Button } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { Mic } from "lucide-react";
import MicVisualizer from "../components/MicVisualizer";

const VoiceAgentConversation = () => {
  const [instruction, setInstruction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("ready"); // "ready", "recording", "playing", "processing"
  const [audioBlob, setAudioBlob] = useState(null);

  const { createSession, isConnected, error, connect, session, disconnect } =
    useVoiceAgent();

  const audioPlayerRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);

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
          // Send audio buffer to session if possible
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

  // Listen for audio coming from the session and play it
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

  // Play audioBlob and setup analyser to animate MicVisualizer
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
        "gpt-4o-realtime-preview-2025-06-03"
      );
      await connect(data.value);

      // After connection, start recording automatically
      startRecording();
    } catch (err) {
      console.error("Error connecting to voice agent:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    // Stop recording if active
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }

    // Stop audio playback if any
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }

    // Use context disconnect to close session and update state
    disconnect();

    // Reset local UI states
    setMode("ready");
    setAudioBlob(null);
  };

  if (!isConnected) {
    return (
      <div dir="ltr" className="p-5">
        <h1>Voice Agent Conversation Page ✌️✌️🙌🙌</h1>

        <h3>Instruction</h3>

        <Button
          className="bg-blue-600 text-white my-5 mx-0"
          onClick={handleConnect}
          disabled={isConnected || loading}
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
  }

  return (
    <div className="flex flex-col justify-center h-screen items-center gap-4 p-4">
      <MicVisualizer analyser={analyserRef.current}>
        <Mic size={24} color={mode === "recording" ? "red" : "gray"} />
      </MicVisualizer>

      <Button variant="danger" onClick={handleDisconnect} className="mt-4">
        Disconnect
      </Button>
    </div>
  );
};

export default VoiceAgentConversation;
