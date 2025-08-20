import { useEffect, useReducer, useRef, useState } from "react";
import { sockets } from "../../utils/sockets";
import { BounceLoader, ScaleLoader } from "react-spinners";

const VoiceBtn = ({ onTranscribe }) => {
  const recorderRef = useRef(null);
  const socketRef = useRef(null);
  var chunks = [];
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!socketRef.current)
      socketRef.current = sockets.voice(handleTeranscribeResponse);
  }, []);

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "START_RECORDING":
          if (state.isRecording || action.recorder == null) return state;

          if (action.recorder.state == "inactive") {
            action.recorder.start();
          }

          return { ...state, isRecording: true, recorder: action.recorder };

        case "STOP_RECORDING":
          if (state.recorder == null) return state;

          if (state.recorder.state == "recording") {
            state.recorder.stop();
            setIsLoading(true);
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

  const handleTeranscribeResponse = (event) => {
    const data = event.data;

    try {
      const parsed = JSON.parse(data);
      console.log(event.data);
    } catch (e) {
      onTranscribe(data);
    } finally {
      setIsLoading(false);
    }
  };
  const sendAudioData = () => {
    if (chunks.length === 0) {
      setIsLoading(false);
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
        setTimeout(() => {
          socketRef.current.send(reader.result);
        }, 4000);

      } else {
        console.error("WebSocket is not open. Cannot send audio data.");
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(blob);
  };

  const handleVoiceClick = async () => {
    if (state.isRecording) {
      dispatch({ type: "STOP_RECORDING" });
      setIsLoading(true)
    } else {
      if (!checkMicSupport()) return;

      const stream = await getStream();

      if (!stream) return;

      recorderRef.current = recorderFactory(stream);
      setIsLoading(false)
      dispatch({ type: "START_RECORDING", recorder: recorderRef.current });
    }
  };

  const recorderFactory = (stream) => {
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (event) => {
      pushChunk(event);
    };

    recorder.onstop = () => {
      sendAudioData();

    };

    return recorder;
  };

  const pushChunk = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  const checkMicSupport = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return true;
    } else {
      console.log("getUserMedia not supported on your browser!");
      return false;
    }
  };

  const getStream = async () => {
    return navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })

      .then((stream) => {
        return stream;
      })

      .catch((err) => {
        alert("Microphone permission is required to use voice input.");

        console.error(`The following getUserMedia error occurred: ${err}`);

        return false;
      });
  };

  return (
    <button
      className="flex items-center justify-center mb-4"
      onClick={handleVoiceClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <ScaleLoader
          barCount={3}
          height={15}
          radius={2}
          speedMultiplier={1}
          width={4}
          color="#06c"
          className="mb-1 ml-0.5"
        />
      ) : state.isRecording ? (
        <BounceLoader
          color="red"
          size={18}
          className="mb-1 ml-0.5"
        />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-blue-600 "
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
