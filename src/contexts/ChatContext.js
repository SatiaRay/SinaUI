import { createContext, useContext, useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getWebSocketUrl } from "../utils/websocket";
import {
  dataNormalizer,
  mergeNormalized,
  stripHtmlTags,
} from "../utils/helpers";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // State
  const [chatLoading, setChatLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [historyOffset, setHistoryOffset] = useState(0);
  const [error, setError] = useState(null);
  const [currentWizards, setCurrentWizards] = useState([]);
  const [rootWizards, setRootWizards] = useState([]);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [optionMessageTriggered, setOptionMessageTriggered] = useState(false);
  const [history, setHistory] = useState({ ids: [], entities: {} });

  // custom socket handlers
  const [handlers, setHandlers] = useState({});
  const handlersRef = useRef(handlers);

  // update handlers ref each time state changes
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  // Refs
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
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

        // setOptionMessageTriggered(true);
      };

      test();

      // load root wizards
      loadRootWizards();

      // init socket connection
      connectSocket(sessionId);
    }
  }, []);

  /**
   * Register handler for on open socket event
   *
   * @param {function} handler
   */
  const registerSocketOnOpenHandler = (handler) => {
    setHandlers((prev) => ({ ...prev, ["open"]: handler }));
  };

  /**
   * Register handler for on close socket event
   *
   * @param {function} handler
   */
  const registerSocketOnCloseHandler = (handler) => {
    setHandlers((prev) => ({ ...prev, ["close"]: handler }));
  };

  /**
   * Register handler for on error socket event
   *
   * @param {function} handler
   */
  const registerSocketOnErrorHandler = (handler) => {
    setHandlers((prev) => ({ ...prev, ["error"]: handler }));
  };

  /**
   * Register handler for on message socket event
   *
   * @param {function} handler
   */
  const registerSocketOnMessageHandler = (handler) => {
    setHandlers((prev) => ({ ...prev, ["message"]: handler }));
  };

  /**
   * Get chat session id which stored in local storage
   *
   * Creates new if not exists in local storage
   */
  const getSessionId = () => {
    let sessionId = localStorage.getItem("chat_session_id");
    if (!sessionId) {
      sessionId = `uuid_${uuidv4()}`;
      localStorage.setItem("chat_session_id", sessionId);
    }
    return sessionId;
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
   * @param {string} sessionId
   * @param {number} offset
   * @param {number} limit
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
          id: uuidv4(),
          type: msg.role === "user" ? "question" : "answer",
          text: msg.role === "user" ? msg.body : undefined,
          answer: msg.role === "assistant" ? msg.body : undefined,
          timestamp: new Date(msg.created_at),
        }));

        const reversedMessages = dataNormalizer(
          [...transformedMessages].reverse()
        );

        if (offset === 0) {
          setHistory(reversedMessages);
        } else {
          setHistory((prev) => mergeNormalized(prev, reversedMessages));
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
    const socket = new window.WebSocket(
      getWebSocketUrl(`/ws/ask?session_id=${sessionId}`)
    );

    socket.onopen = () => {
      if (handlersRef.current.open) handlersRef.current.open();
    };

    socket.onmessage = (event) => {
      if (handlersRef.current.message) handlersRef.current.message(event);
    };

    socket.onclose = (event) => {
      if (handlersRef.current.close) handlersRef.current.close(event);
    };

    socket.onerror = (event) => {
      if (handlersRef.current.error) handlersRef.current.error(event);
    };

    socketRef.current = socket;
  };

  /**
   * Send new message
   *
   * @param {string} text
   * @returns sent message object
   */
  const sendMessage = async (text) => {
    if (socketRef.current) {
      const userMessage = {
        type: "question",
        text,
        timestamp: new Date(),
      };

      addNewMessage(userMessage);

      socketRef.current.send(
        JSON.stringify({
          event: "message",
          text: text,
        })
      );
      setChatLoading(true);
    }
  };

  /**
   * Uploads image to the socket channel
   *
   * @param {Array} images
   */
  const sendImage = async (images) => {
    if (socketRef.current) {
      const userMessage = {
        type: "image",
        images: images,
        timestamp: new Date(),
      };

      addNewMessage(userMessage);

      socketRef.current.send(
        JSON.stringify({
          event: "upload",
          files: images,
        })
      );
      setChatLoading(true);
    }
  };

  /**
   * Send custom data to the socket channel
   *
   * @param {object} data
   */
  const sendData = async (data) => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify(data));
    }
  };

  /**
   * Adds new message to the chat history
   *
   * @param {object} messageData
   */
  const addNewMessage = (messageData) => {
    messageData.id = uuidv4();

    setHistory((prev) => ({
      ids: [...prev.ids, messageData.id],
      entities: { ...prev.entities, [messageData.id]: messageData },
    }));

    return messageData.id
  };

  /**
   * Update message context by id
   * 
   * @param {number} id 
   * @param {String} context 
   */
  const updateMessage = (id, data) => {

    setHistory((prev) => {
      if (!prev.entities[id]) return prev; // no such message

      console.log(prev.entities[id].answer);
      

      return {
        ids: [...prev.ids],
        entities: {
          ...prev.entities,
          [id]: {
            ...prev.entities[id],
            ...data, // merge new data into the message
          },
        },
      };
    });
  };

  /**
   * Handles wizard selection
   *
   * @param {object} wizardData selected wizard data
   */
  const handleWizardSelect = (wizardData) => {
    if (wizardData.wizard_type === "question") {
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

  // Context value
  const value = {
    chatLoading,
    setChatLoading,
    historyLoading,
    setHistoryLoading,
    hasMoreHistory,
    setHasMoreHistory,
    historyOffset,
    setHistoryOffset,
    error,
    setError,
    currentWizards,
    setCurrentWizards,
    rootWizards,
    setRootWizards,
    copiedMessageId,
    setCopiedMessageId,
    optionMessageTriggered,
    setOptionMessageTriggered,
    history,
    setHistory,
    chatContainerRef,
    chatEndRef,
    socketRef,
    getSessionId,
    loadRootWizards,
    loadHistory,
    connectSocket,
    sendMessage,
    sendImage,
    sendData,
    handleWizardSelect,
    addNewMessage,
    updateMessage,
    registerSocketOnOpenHandler,
    registerSocketOnCloseHandler,
    registerSocketOnErrorHandler,
    registerSocketOnMessageHandler,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);
