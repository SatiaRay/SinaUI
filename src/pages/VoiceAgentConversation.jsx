import { useEffect, useState, useRef } from 'react';
import { useVoiceAgent } from '../contexts/VoiceAgentContext';
import { Button } from 'react-bootstrap';
import { ClipLoader } from 'react-spinners';
import MicVisualizer from '../components/MicVisualizer';
import { AudioLines, Mic, MicVocal } from 'lucide-react';
import {
  submitRequest,
  neshanSearch,
  searchSubject,
} from '../services/ai_tools_function';
import { aiFunctionsEndpoints, voiceAgentEndpoints } from '../utils/apis';
import { useNavigate } from 'react-router-dom';

const VoiceAgentConversation = () => {
  const [instruction, setInstruction] = useState(null);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('ready');
  const [audioBlob, setAudioBlob] = useState(null);
  const navigate = useNavigate();

  // 📝 Conversation transcript
  const [conversation, setConversation] = useState([]);
  const [showConversation, setShowConversation] = useState(false);

  // Audio & session refs
  const audioPlayerRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);

  const { createSession, isConnected, error, connect, session, disconnect } =
    useVoiceAgent();

  // Load instruction + tools
  useEffect(() => {
    const fetchInstruction = async () => {
      const res = await voiceAgentEndpoints.getVoiceAgentInstruction();
      setInstruction(res.instruction);
    };

    const fetchToolFunctions = async () => {
      await aiFunctionsEndpoints.getFunctionsMap();
      setTools([submitRequest, neshanSearch, searchSubject]);
    };

    fetchInstruction();
    fetchToolFunctions();
  }, []);

  // Create session when ready
  const [sessionCreated, setSessionCreated] = useState(false);
  useEffect(() => {
    if (!sessionCreated && instruction && Array.isArray(tools)) {
      createSession(instruction, tools);
      setSessionCreated(true);
    }
  }, [instruction, tools, sessionCreated, createSession]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error('VoiceAgentConversation error:', error);
      alert('An error occurred: ' + error);
    }
  }, [error]);

  // 🎤 Start recording
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
        mimeType: 'audio/webm',
      });

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const arrayBuffer = await event.data.arrayBuffer();
          try {
            await session?.sendAudio(arrayBuffer);
          } catch (err) {
            console.error('Failed to send audio:', err);
          }
        }
      };

      mediaRecorderRef.current.start(100);
      setMode('recording');
      setShowConversation(false);
    } catch (err) {
      console.error('Error starting recording:', err);
      setMode('ready');
    }
  };

  // 🎤 Handle audio & transcripts
  useEffect(() => {
    if (!session) return;

    const handleAudio = (event) => {
      const blob = new Blob([event.audioData], { type: 'audio/mp3' });
      setAudioBlob(blob);
      setMode('playing');
    };

    session.on('audio', handleAudio);

    session.on('input_transcript.delta', (e) => {
      setConversation((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'user') {
          return [...prev.slice(0, -1), { ...last, text: last.text + e.delta }];
        }
        return [...prev, { role: 'user', text: e.delta }];
      });
    });

    session.on('response.output_text.delta', (e) => {
      setConversation((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return [...prev.slice(0, -1), { ...last, text: last.text + e.delta }];
        }
        return [...prev, { role: 'assistant', text: e.delta }];
      });
    });

    session.on('response.completed', (res) => {
      setConversation((prev) => [
        ...prev,
        { role: 'assistant', text: res.output_text },
      ]);
    });

    return () => {
      session.off('audio', handleAudio);
      session.off('input_transcript.delta');
      session.off('response.output_text.delta');
      session.off('response.completed');
    };
  }, [session]);

  // 🔊 Playback AI audio
  useEffect(() => {
    if (mode !== 'playing' || !audioBlob) return;

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
      setMode('ready');
      setAudioBlob(null);
    };

    audioPlayerRef.current.play().catch(console.error);

    return () => {
      audioPlayerRef.current?.pause();
      audioPlayerRef.current?.removeEventListener('ended', () => {});
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
      console.error('Error connecting to voice agent:', err);
    } finally {
      setLoading(false);
      setShowConversation(false);
    }
  };

  // ⏹ Stop recording but keep conversation
  const handleStopAndShowConversation = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }

    setMode('ready');
    setAudioBlob(null);
    setShowConversation(true);
  };

  // ❌ Disconnect fully
  const handleDisconnect = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
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
    setMode('ready');
    setAudioBlob(null);
    setShowConversation(false);
    setConversation([]); // clear only on full disconnect
  };

  // 🖼️ UI
  if (!isConnected) {
    return (
      <div className="container items-center h-screen flex justify-center">
        <div className="grid justify-center align-center gap-4">
          <AudioLines className="mx-auto" size={200} color="#898989" />
          <p className="text-gray-500">
            با ربات هوش مصنوعی به صورت صوتی گفتگو کنید
          </p>
          <div
            dir="ltr"
            className="flex my-5 w-full justify-center items-center gap-2"
          >
            <button
              onClick={() => navigate('/chat')}
              className="text-blue-600 hover:bg-blue-600/90 border border-blue-600 hover:text-white w-[48%] px-4 rounded-lg h-10 flex items-center justify-center w-auto justify-self-center"
            >
              بازگشت به چت
            </button>
            <Button
              className="bg-blue-600 text-white w-[48%] h-10 flex hover:bg-blue-600/90 items-center justify-center w-auto justify-self-center"
              onClick={handleConnect}
              disabled={isConnected || loading}
            >
              {!isConnected && loading ? (
                <ClipLoader color="white" size={15} />
              ) : (
                <>
                  <span className="mx-2 text-sm">شروع گفتگو</span>
                  <MicVocal size={20} />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center h-screen items-center gap-4 p-4">
      <MicVisualizer analyser={analyserRef.current}>
        <Mic size={24} color={mode === 'recording' ? 'red' : 'gray'} />
      </MicVisualizer>

      <button
        className="text-gray-800 hover:text-blue-600"
        onClick={handleStopAndShowConversation}
      >
        پایان ضبط
      </button>
      {/* <div
        className="bg-neutral-50 rounded-lg shadow-xl border p-4 w-full max-w-md h-64 overflow-y-auto text-right"
        dir="rtl"
      >
        {conversation.map((line, i) => (
          <p key={i} className="text-black">
            <b>{line.role === "user" ? "کاربر" : "دستیار"}:</b> {line.text}
          </p>
        ))}
      </div> */}

      <div className="flex gap-2 mt-4">
        <button
          className="px-4 bg-gray-800 hover:bg-gray-800/90 text-white rounded-lg  h-10 text-sm"
          onClick={handleDisconnect}
        >
          قطع ارتباط
        </button>
      </div>
    </div>
  );
};

export default VoiceAgentConversation;
