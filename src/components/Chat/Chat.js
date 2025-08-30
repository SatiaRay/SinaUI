import { LucideAudioLines } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaRobot } from "react-icons/fa";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { v4 as uuidv4 } from "uuid";
import { getWebSocketUrl } from "../../utils/websocket";
import VoiceBtn from "./VoiceBtn";
import { WizardButtons } from "./Wizard/";
import TextInputWithBreaks from "../../ui/textArea";
import Message from "../ui/chat/message/Message";
import {
  copyToClipboard,
  formatTimestamp,
  stripHtmlTags,
} from "../../utils/helpers";
import { logDOM } from "@testing-library/react";

const Chat = ({ item }) => {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [historyOffset, setHistoryOffset] = useState(0);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [currentWizards, setCurrentWizards] = useState([]);
  const [rootWizards, setRootWizards] = useState([]);
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);
  const socketRef = useRef(null);
  const initialMessageAddedRef = useRef(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  let inCompatibleMessage = "";
  let bufferedTable = "";
  let isInsideTable = false;
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  /**
   * OnMount
   */
  useEffect(() => {
    const sessionId = getSessionId();

    const test = async () => {
      // load chat history
      await loadHistory(sessionId);

      addNewMessage({
        type: "option",
        metadata: {
          event: "trigger",
          option: "upload",
          upload_type: "image",
          caption: "لطفا تصویر خودرو خود را بارگزاری کنید.",
        },
      });
    };

    test();

    // load root wizards
    loadRootWizards();

    // init socket connection
    connectSocket(sessionId);
  }, []);

  useEffect(() => {
    return renderMessageLinks();
  }, [history]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLoading]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [historyLoading, hasMoreHistory, historyOffset]);

  /**
   * Trigger scroll to button fuction on history loading or change history length
   */
  useEffect(() => {
    if (!historyLoading && history.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [historyLoading, history.length]);

  /**
   * render chat messages links
   *
   * @returns function
   */
  const renderMessageLinks = () => {
    const timer = setTimeout(() => {
      const chatLinks = document.querySelectorAll(".chat-message a");
      chatLinks.forEach((link) => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      });
    }, 100);
    return () => clearTimeout(timer);
  };

  /**
   * Get chat session id which stored in local storage
   *
   * Creates new if not exists in local storage
   */
  const getSessionId = () => {
    let sessionId = localStorage.getItem("chat_session_id"); // try fetch the session id from local storage

    // create new if not exists in local storage
    if (!sessionId) {
      sessionId = `uuid_${uuidv4()}`;
      localStorage.setItem("chat_session_id", sessionId);
    }

    return sessionId;
  };

  /**
   * Scroll chat history to bottom to display end message
   */
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  /**
   * Load root wizards to display wizard buttons to user
   */
  const loadRootWizards = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_CHAT_API_URL}/wizards/hierarchy/roots`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("خطا در دریافت ویزاردها");
      }
      const data = await response.json();
      setRootWizards(data);
      setCurrentWizards(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setChatLoading(false);
    }
  };

  /**
   * Load the chat history
   */
  const loadHistory = async (sessionId, offset = 0, limit = 20) => {
    setHistoryLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_CHAT_API_URL}/chat/history/${sessionId}?offset=${offset}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status !== 200) {
        return;
      }

      const messages = await response.json();

      if (Array.isArray(messages)) {
        const transformedMessages = messages.map((msg) => ({
          type: msg.role === "user" ? "question" : "answer",
          text: msg.role === "user" ? msg.body : undefined,
          answer: msg.role === "assistant" ? msg.body : undefined,
          timestamp: new Date(msg.created_at),
        }));

        const reversedMessages = [...transformedMessages].reverse();

        if (offset === 0) {
          setHistory(reversedMessages);
        } else {
          setHistory((prev) => [...reversedMessages, ...prev]);
        }
        setHasMoreHistory(messages.length === limit);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching chat history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  /**
   * Handle message finished event
   */
  const finishMessageHandler = () => {
    setChatLoading(false);
    if (isInsideTable && bufferedTable) {
      setHistory((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = {
          ...updated[lastIndex],
          answer: inCompatibleMessage,
        };
        return updated;
      });
      bufferedTable = "";
      isInsideTable = false;
    }

    inCompatibleMessage = "";
  };

  /**
   * Handle tirgger option event
   */
  const triggerOptionHandler = (optionInfo) => {
    const optionMessage = {
      type: "option",
      metadata: optionInfo,
      timestamp: new Date(),
    };

    addNewMessage(optionMessage);
  };

  /**
   * Open chat socket connection
   * @param {string} sessionId
   */
  const connectSocket = (sessionId) => {
    const socket = new WebSocket(
      getWebSocketUrl(`/ws/ask?session_id=${sessionId}`)
    );

    socket.onopen = socketOnOpenHandler;

    socket.onmessage = socketOnMessageHandler;

    socket.onclose = socketOnCloseHandler;

    socket.onerror = socketOnErrorHandler;

    socketRef.current = socket;
  };

  /**
   * socket on open event handler
   */
  const socketOnOpenHandler = () => {
    //
  };

  /**
   * socket on open event handler
   *
   * @param {object} event
   */
  const socketOnMessageHandler = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.event) {
        switch (data.event) {
          // handle trigger option event
          case "trigger":
            triggerOptionHandler(data);
            break;

          case "delta":
            handleDeltaResponse(event);
            break;

          case "finished":
            finishMessageHandler();
            break;
        }
      }
    } catch (e) {
      console.log("Error on message event", e);
    }
  };

  /**
   * socket on close event handler
   *
   * @param {object} event
   */
  const socketOnCloseHandler = (event) => {
    setChatLoading(false);
    if (isInsideTable && bufferedTable) {
      setHistory((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = {
          ...updated[lastIndex],
          answer: inCompatibleMessage,
        };
        return updated;
      });
      bufferedTable = "";
      isInsideTable = false;
    }
    setChatLoading(false);
  };

  /**
   * socket on error event handler
   *
   * @param {object} event
   */
  const socketOnErrorHandler = (event) => {
    console.error("WebSocket error:", error);
    setError("خطا در ارتباط با سرور");
    setChatLoading(false);
  };

  /**
   * Send new message
   *
   * @returns sent message object
   */
  const sendMessage = async (text) => {
    const currentQuestion = text;

    setQuestion("");
    setError(null);

    const userMessage = {
      type: "question",
      text: currentQuestion,
      timestamp: new Date(),
    };
    setHistory((prev) => [...prev, userMessage]);

    initialMessageAddedRef.current = false;
    inCompatibleMessage = "";
    bufferedTable = "";
    isInsideTable = false;

    socketRef.current.send(
      JSON.stringify({
        question: currentQuestion,
      })
    );
    setChatLoading(true);
  };

  const handleDeltaResponse = (event) => {
    const data = JSON.parse(event.data);

    try {
      if (data.event === "finished") {
        if (isInsideTable && bufferedTable) {
          setHistory((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            updated[lastIndex] = {
              ...updated[lastIndex],
              answer: inCompatibleMessage,
            };
            return updated;
          });
          bufferedTable = "";
          isInsideTable = false;
        }
        setChatLoading(false);

        inCompatibleMessage = "";
        return;
      }
    } catch (e) {}

    if (!initialMessageAddedRef.current) {
      const botMessage = {
        type: "answer",
        answer: "",
        sources: [],
        timestamp: new Date(),
      };
      setHistory((prev) => [...prev, botMessage]);
      initialMessageAddedRef.current = true;
      setChatLoading(true);
    }

    let delta = data.message;

    inCompatibleMessage += delta;

    if (inCompatibleMessage.includes("<table")) {
      isInsideTable = true;
      bufferedTable += delta;
    } else if (isInsideTable) {
      bufferedTable += delta;
    } else {
      setHistory((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = {
          ...updated[lastIndex],
          answer: inCompatibleMessage,
        };
        return updated;
      });
      return;
    }

    if (isInsideTable) {
      const openTableTags = (bufferedTable.match(/<table/g) || []).length;
      const closeTableTags = (bufferedTable.match(/<\/table>/g) || []).length;

      if (openTableTags === closeTableTags && openTableTags > 0) {
        setHistory((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = {
            ...updated[lastIndex],
            answer: inCompatibleMessage,
          };
          return updated;
        });
        bufferedTable = "";
        isInsideTable = false;
      } else {
        const openTrTags = (bufferedTable.match(/<tr>/g) || []).length;
        const closeTrTags = (bufferedTable.match(/<\/tr>/g) || []).length;

        if (openTrTags > closeTrTags) {
          const lastOpenTrIndex = bufferedTable.lastIndexOf("<tr>");
          if (lastOpenTrIndex !== -1) {
            const partialMessage = bufferedTable.substring(0, lastOpenTrIndex);
            setHistory((prev) => {
              const updated = [...prev];
              const lastIndex = updated.length - 1;
              updated[lastIndex] = {
                ...updated[lastIndex],
                answer: inCompatibleMessage.replace(
                  bufferedTable,
                  partialMessage
                ),
              };
              return updated;
            });
          }
          return;
        }

        const lastCompleteRowIndex = bufferedTable.lastIndexOf("</tr>");
        if (lastCompleteRowIndex !== -1) {
          const partialTable = bufferedTable.substring(
            0,
            lastCompleteRowIndex + 5
          );
          setHistory((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            updated[lastIndex] = {
              ...updated[lastIndex],
              answer: inCompatibleMessage.replace(bufferedTable, partialTable),
            };
            return updated;
          });
        }
      }
    }
  };

  /**
   * Adds new message to the chat history
   *
   * @param {object} messageData
   */
  const addNewMessage = (messageData) => {
    setHistory((prev) => [...prev, messageData]);
  };

  /**
   * @param {object} wizardData selected wizard data
   */
  const handleWizardSelect = (wizardData) => {
    if (wizardData.wizard_type == "question") {
      sendMessage(stripHtmlTags(wizardData.context));

      return;
    }

    setHistory((prev) => [
      ...prev,
      {
        type: "answer",
        answer: wizardData.context,
        timestamp: new Date(),
      },
    ]);

    if (wizardData.children && wizardData.children.length > 0) {
      setCurrentWizards(wizardData.children);
    } else {
      setCurrentWizards(rootWizards);
    }
  };

  const handleScroll = () => {
    if (!chatContainerRef.current || historyLoading || !hasMoreHistory) return;
  };

  return (
    <div className="flex flex-col overflow-x-hidden h-screen md:p-7 pt-9 pb-7 px-2 w-full max-w-[1220px] mx-auto">
      <div
        ref={chatContainerRef}
        className="flex-1 scrollbar-hidden overflow-y-auto mb-4 space-y-4"
        style={{ height: "calc(100vh - 200px)" }}
      >
        {historyLoading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
            <p className="text-gray-600 dark:text-gray-300">
              در حال بارگذاری تاریخچه...
            </p>
          </div>
        )}

        {history.length === 0 && !historyLoading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 p-4">
            سوال خود را بپرسید تا گفتگو شروع شود
          </div>
        ) : (
          history.map((item, index) => (
            <div
              key={index}
              className="mb-4 transition-[height] duration-300 ease-in-out"
            >
              <Message messageIndex={index} data={item} />
            </div>
          ))
        )}
        {chatLoading && (
          <div className="flex items-center justify-end p-1 gap-1 text-white">
            <BeatLoader size={9} color="#808080" />
            <span className="p-1.5 rounded-lg shadow-lg dark:bg-[#202936] bg-white flex items-center justify-center">
              <FaRobot className="w-4 mb-1 dark:text-gray-300 text-gray-800" />
            </span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <WizardButtons
        onWizardSelect={handleWizardSelect}
        wizards={currentWizards}
      />

      <div className="flex items-end justify-end overflow-hidden w-full max-h-[200vh] min-h-12 px-2 bg-gray-50 dark:bg-gray-900 gap-2 rounded-3xl shadow-lg border">
        <button
          onClick={() => sendMessage(question)}
          onKeyDown={() => sendMessage(question)}
          disabled={chatLoading || !question.trim()}
          className="p-2 mb-[7px] text-blue-600 disabled:text-gray-400 rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
        >
          <svg
            className="w-6 h-6 bg-transparent"
            fill="#2663eb"
            viewBox="0 0 24 24"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
        <TextInputWithBreaks
          value={question}
          onChange={setQuestion}
          onSubmit={() => sendMessage(question)}
          disabled={chatLoading}
          placeholder="سوال خود را بپرسید..."
        />
        <div
          className={`max-w-60 flex items-center justify-center gap-2 mb-[9px] ${
            question.trim() ? "hidden" : ""
          }`}
        >
          <VoiceBtn onTranscribe={setQuestion} />
          <button
            onClick={() => navigate("/voice-agent")}
            className="bg-blue-200 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-blue-300 p-1.5 rounded-full"
          >
            <LucideAudioLines size={22} />
          </button>
        </div>
        )
      </div>
      {error && <div className="text-red-500 mt-2 text-right">{error}</div>}
    </div>
  );
};

export default Chat;
