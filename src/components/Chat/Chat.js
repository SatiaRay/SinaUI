import { LucideAudioLines } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { FaRobot } from "react-icons/fa";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { v4 as uuidv4 } from "uuid";
import { notify } from "../../ui/toast";
import { getWebSocketUrl } from "../../utils/websocket";
import VoiceBtn from "./VoiceBtn";
import { WizardButtons } from "./Wizard/";
import TextInputWithBreaks from "../../ui/textArea";
import { copyToClipboard, formatTimestamp, stripHtmlTags } from "../../utils/helpers";

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
  const textRef = useRef(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const chatLoadingRef = useRef(chatLoading);
  const timeoutRef = useRef(null); // old timeout, for compatibility
  const initialResponseTimeoutRef = useRef(null); // 1-minute timeout for initial bot response
  const deltaTimeoutRef = useRef(null); // 10-second timeout between deltas

  let inCompatibleMessage = "";
  let bufferedTable = "";
  let isInsideTable = false;

  // Update chatLoadingRef whenever chatLoading changes
  useEffect(() => {
      chatLoadingRef.current = chatLoading;
  }, [chatLoading]);

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

    /** Reset chat state to initial state */
    const resetChatState = () => {
        setChatLoading(false);

        if (isInsideTable && bufferedTable) {
            setHistory((prev) => {
                const updated = [...prev];
                const lastIndex = updated.length - 1;
                updated[lastIndex] = {...updated[lastIndex], answer: inCompatibleMessage};
                return updated;
            });
            bufferedTable = "";
            isInsideTable = false;
        }

        inCompatibleMessage = "";
        initialMessageAddedRef.current = false;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (initialResponseTimeoutRef.current) {
            clearTimeout(initialResponseTimeoutRef.current);
            initialResponseTimeoutRef.current = null;
        }
        if (deltaTimeoutRef.current) {
            clearTimeout(deltaTimeoutRef.current);
            deltaTimeoutRef.current = null;
        }
    };

  /**
   * OnMount
   */
  useEffect(() => {
    const sessionId = getSessionId();

    // load chat history
    loadHistory(sessionId);

    // load root wizards
    loadRootWizards();

    // init socket connection
    connectSocket(sessionId);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (initialResponseTimeoutRef.current) clearTimeout(initialResponseTimeoutRef.current);
      if (deltaTimeoutRef.current) clearTimeout(deltaTimeoutRef.current);
    };
  }, []);



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

    /** Render links in chat messages safely */
    useEffect(() => {
        return renderMessageLinks();
    }, [history]);

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
          case "finished":
          resetChatState();
            break;
            case "delta":
            handleDeltaResponse(event);
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
      resetChatState();
  };

  /**
   * socket on error event handler
   *
   * @param {object} event
   */
  const socketOnErrorHandler = (event) => {
    console.error("WebSocket error:", error);
    setError("خطا در ارتباط با سرور");
    resetChatState();
  };

  /**
   * Send new message
   *
   * @returns sent message object
   */
  const sendMessage = async (text) => {
        if (!text.trim()) return;
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
      // 1-minute timeout: If bot does not respond at all
    if (initialResponseTimeoutRef.current) clearTimeout(initialResponseTimeoutRef.current);
    initialResponseTimeoutRef.current = setTimeout(() => {
        notify.error("مشکلی پیش امده لطفا بعدا تلاش نمایید.", {
            autoClose: 4000, position: "top-left",
        });
        resetChatState();
    }, 60000);

    // Clear delta timeout if any
    if (deltaTimeoutRef.current) {
        clearTimeout(deltaTimeoutRef.current);
        deltaTimeoutRef.current = null;
    }
    
  };


  const handleDeltaResponse = (event) => {
    const data = JSON.parse(event.data);
    if (!initialMessageAddedRef.current) {
         if (initialResponseTimeoutRef.current) {
          clearTimeout(initialResponseTimeoutRef.current);
          initialResponseTimeoutRef.current = null;
      }
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

        // Reset 10-second delta timeout on each delta
    if (deltaTimeoutRef.current) clearTimeout(deltaTimeoutRef.current);
    deltaTimeoutRef.current = setTimeout(() => {
        resetChatState(); // 10-second timeout between deltas
    }, 10000);

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
   * @param {object} wizardData selected wizard data
   */
  const handleWizardSelect = (wizardData) => {
    if(wizardData.wizard_type == 'question'){
      sendMessage(stripHtmlTags(wizardData.context));

      return
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

  /**
   * Copy answer message text to device clipboard
   *
   * @param {string} textToCopy
   * @param {int} messageIndex
   */
  const handleCopyAnswer = (textToCopy, messageIndex) => {
    const temp = document.createElement("div");
    temp.innerHTML = textToCopy;
    const plainText = temp.textContent || temp.innerText || "";

    copyToClipboard(plainText)
      .then(() => {
        setCopiedMessageId(messageIndex);
        notify.success("متن کپی شد!", {
          autoClose: 1000,
          position: "top-left",
        });

        setTimeout(() => setCopiedMessageId(null), 4000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
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
              {item.type === "question" ? (
                <div className="bg-blue-100/70 md:ml-16 dark:bg-blue-900/20 p-3 rounded-lg text-right">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(item.timestamp)}
                    </span>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      شما
                    </span>
                  </div>
                  <pre
                    className="text-gray-800 pt-1 leading-5 dark:text-white [&_a]:text-blue-600 [&_a]:hover:text-blue-700 [&_a]:underline [&_a]:break-all dark:[&_a]:text-blue-400 dark:[&_a]:hover:text-blue-300"
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                </div>
              ) : (
                <div className=" bg-white dark:bg-gray-800 px-4 py-2 flex flex-col text-wrap md:ml-1 md:mr-8 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(item.timestamp)}
                    </span>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      چت‌بات
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
                      پاسخ:
                    </h3>
                    <pre
                      ref={textRef}
                      style={{
                        unicodeBidi: "plaintext",
                        direction: "rtl",
                      }}
                      className="text-gray-800 flex text-wrap flex-wrap px-2 pt-2 leading-5 dark:text-white [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:bg-white [&_th]:text-black [&_th]:p-2 [&_th]:border [&_th]:border-gray-200 [&_th]:text-right dark:[&_th]:bg-white dark:[&_th]:text-black dark:[&_th]:border-gray-700 [&_td]:p-2 [&_td]:border [&_td]:border-gray-200 [&_td]:text-right dark:[&_td]:text-white dark:[&_td]:border-gray-700 [&_a]:text-blue-600 [&_a]:hover:text-blue-700 [&_a]:underline [&_a]:break-all dark:[&_a]:text-blue-400 dark:[&_a]:hover:text-blue-300"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                    <button
                      onClick={() => handleCopyAnswer(item.answer, index)}
                      className="mt-4 flex items-center justify-center w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      style={{
                        color: copiedMessageId === index ? "#3dc909" : "#444",
                      }}
                    >
                      {copiedMessageId === index ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="dark:text-gray-100"
                        >
                          <g transform="scale(-1,1) translate(-24,0)">
                            <rect
                              x="9"
                              y="9"
                              width="13"
                              height="13"
                              rx="2"
                              ry="2"
                            />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </g>
                        </svg>
                      )}
                    </button>
                  </div>
                  {item.sources && item.sources.length > 0 && (
                    <div>
                      <h3 className="font-bold mb-2 text-sm text-gray-900 dark:text-white">
                        منابع:
                      </h3>
                      <ul className="list-disc pr-4">
                        {item.sources.map((source, sourceIndex) => (
                          <li key={sourceIndex} className="mb-2">
                            <p className="text-sm text-gray-700 dark:text-white">
                              {source.text}
                            </p>
                            <a
                              href={source.metadata?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              منبع: {source.metadata?.source || "نامشخص"}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
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
      </div>
      {error && <div className="text-red-500 mt-2 text-right">{error}</div>}
    </div>
  );
};

export default Chat;