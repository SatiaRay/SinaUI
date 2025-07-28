import { useEffect, useReducer, useRef, useState } from "react";
import { sockets } from "../../utils/sockets";
import { DotLoader } from "react-spinners";

const VoiceBtn = ({ onTranscribe }) => {
  const recorderRef = useRef(null);
  const socketRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  var chunks = [];

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = sockets.voice(handleTranscribeResponse);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "START_RECORDING":
          if (state.isRecording || action.recorder == null) {
            return state;
          }

          if (action.recorder.state == "inactive") {
            action.recorder.start();
            console.log("Recording started");
          }

          return { ...state, isRecording: true, recorder: action.recorder };

        case "STOP_RECORDING":
          if (state.recorder == null) {
            return state;
          }

          if (state.recorder.state == "recording") {
            state.recorder.stop();
            console.log("Recording stopped");
            setIsProcessing(true);
          }

          return { ...state, isRecording: false, recorder: null };

        default:
          return state;
      }
    },
    {
      isRecording: false,
      recorder: null,
    }
  );

  const handleTranscribeResponse = (event) => {
    setIsProcessing(false);
    const data = event.data;

    try {
      const parsed = JSON.parse(data);
      console.log(event.data);
    } catch (e) {
      onTranscribe(data);
    }
  };

  const sendAudioData = () => {
    if (chunks.length === 0) {
      setIsProcessing(false);
      return;
    }

    const blob = new Blob(chunks, { type: "audio/webm" });
    chunks = [];

    const reader = new FileReader();
    reader.onloadend = () => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(reader.result);
        console.log("Audio data sent to server");
      } else {
        console.error("WebSocket is not open. Cannot send audio data.");
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      console.error("Failed to read audio blob.");
      setIsProcessing(false);
    };

    reader.readAsArrayBuffer(blob);
  };

  const handleVoiceClick = async () => {
    if (state.isRecording) {
      dispatch({ type: "STOP_RECORDING" });
    } else {
      if (!checkMicSupport()) return;

      const stream = await getStream();
      if (!stream) return;

      recorderRef.current = recorderFactory(stream);
      dispatch({ type: "START_RECORDING", recorder: recorderRef.current });
    }
  };

  const recorderFactory = (stream) => {
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      sendAudioData();
    };

    return recorder;
  };

  const checkMicSupport = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return true;
    } else {
      console.log("getUserMedia not supported on your browser!");
      return false;
    }
  };

  const getStream = async () => {
    try {
      return await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      alert("Microphone permission is required to use voice input.");
      console.error(`getUserMedia error: ${err}`);
      return false;
    }
  };

  return (
    <button
      className={`chat-submit-button w-full flex items-center justify-center ${
        isProcessing && "rgba(59, 131, 246, 0.58)"
      }`}
      onClick={handleVoiceClick}
      disabled={isProcessing || state.isRecording}
    >
      {isProcessing ? (
        <DotLoader color="#0068a8" size={22} />
      ) : state.isRecording ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-red-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="8" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-gray-100"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 14a3.996 3.996 0 0 0 4-4V5a4 4 0 0 0-8 0v5a3.996 3.996 0 0 0 4 4zm5-4a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-4.08A7 7 0 0 0 19 10h-2z" />
        </svg>
      )}
    </button>
  );
};

export default VoiceBtn;
