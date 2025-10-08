import { createContext, useContext, useRef, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getWebSocketUrl } from '../utils/websocket';
import {
  dataNormalizer,
  mergeNormalized,
  packFile,
  stripHtmlTags,
} from '../utils/helpers';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [historyOffset, setHistoryOffset] = useState(0);
  const [error, setError] = useState(null);
  const [currentWizards, setCurrentWizards] = useState([]);
  const [rootWizards, setRootWizards] = useState([]);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [optionMessageTriggered, setOptionMessageTriggered] = useState(false);
  const [history, setHistory] = useState({ ids: [], entities: {} });
  const { token } = useAuth();

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

      loadHistory(sessionId);

      loadRootWizards();

      // init socket connection
      connectSocket(sessionId);
    }
  }, []);

  /**
   * Disconnects socket channel through unset socket ref
   */
  const disconnectChatSocket = () => {
    if (socketRef.current) {
      // Gracefully close the socket connection
      socketRef.current.disconnect?.(); // for Socket.IO
      socketRef.current.close?.(); // for native WebSocket

      // Clear the reference to avoid memory leaks
      socketRef.current = null;

      console.log('Chat socket disconnected.');
    }
  };
  /**
   * Register handler for on open socket event
   *
   * @param {function} handler
   */
  const registerSocketOnOpenHandler = (handler) => {
    setHandlers((prev) => ({ ...prev, ['open']: handler }));
  };

  /**
   * Register handler for on close socket event
   *
   * @param {function} handler
   */
  const registerSocketOnCloseHandler = (handler) => {
    setHandlers((prev) => ({ ...prev, ['close']: handler }));
  };

  /**
   * Register handler for on error socket event
   *
   * @param {function} handler
   */
  const registerSocketOnErrorHandler = (handler) => {
    setHandlers((prev) => ({ ...prev, ['error']: handler }));
  };

  /**
   * Register handler for on message socket event
   *
   * @param {function} handler
   */
  const registerSocketOnMessageHandler = (handler) => {
    setHandlers((prev) => ({ ...prev, ['message']: handler }));
  };

  /**
   * Get chat session id which stored in local storage
   *
   * Creates new if not exists in local storage
   */
  const getSessionId = () => {
    let sessionId = localStorage.getItem('chat_session_id');
    if (!sessionId) {
      sessionId = `uuid_${uuidv4()}`;
      localStorage.setItem('chat_session_id', sessionId);
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
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('خطا در دریافت ویزاردها');
      }
      const data = await response.json();
      setRootWizards(data);
      setCurrentWizards(data);
    } catch (err) {
      setError(err.message);
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
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.status !== 200) {
        return;
      }
      const messages = await response.json();

      if (Array.isArray(messages)) {
        const reversedMessages = dataNormalizer([...messages].reverse());

        if (offset === 0) {
          setHistory(reversedMessages);
        } else {
          setHistory((prev) => mergeNormalized(prev, reversedMessages));
        }
        setHasMoreHistory(messages.length === limit);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching chat history:', err);
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
      getWebSocketUrl(`/ws/ask?session_id=${sessionId}&token=${token}`)
    );

    socket.onopen = () => {
      setIsConnected(true);
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
        type: 'text',
        body: text,
        role: 'user',
        created_at: new Date().toISOString().slice(0, 19),
      };

      addNewMessage(userMessage);

      socketRef.current.send(
        JSON.stringify({
          event: 'text',
          text,
        })
      );
    }
  };

  /**
   * Uploads image to the socket channel
   *
   * @param {Array} images
   */
  const sendUploadedImage = async (images) => {
    if (socketRef.current) {
      const userMessage = {
        type: 'image',
        body: JSON.stringify(images),
        role: 'user',
        created_at: new Date().toISOString().split('.')[0],
      };

      setTimeout(() => {
        addNewMessage(userMessage);
      }, 50);

      socketRef.current.send(
        JSON.stringify({
          event: 'image',
          files: images,
        })
      );
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
   * Set service enable through sending its credentials to the channel
   *
   * @param {string} name Service name
   * @param {object} credentials  Service setting credentials
   */
  const setService = async (name, credentials) => {
    if (socketRef.current) {
      socketRef.current.send(
        JSON.stringify({
          event: 'service',
          name,
          credentials,
        })
      );
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

    return messageData.id;
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
   * Remove message from the history
   * @param {number} id
   */
  const removeMessage = (id) => {
    const filtered = Object.values(history.entities).filter(
      (message) => message.id != id
    );

    setHistory(dataNormalizer(filtered));
  };

  /**
   * Handles wizard selection
   *
   * @param {object} wizardData selected wizard data
   */
  const handleWizardSelect = (wizardData) => {
    if (wizardData.wizard_type === 'question') {
      sendMessage(stripHtmlTags(wizardData.context));
      return;
    } else
      sendData({
        event: 'wizard',
        wizard_id: wizardData.id,
      });

    if (wizardData.children && wizardData.children.length > 0) {
      setCurrentWizards(wizardData.children);
    } else {
      setCurrentWizards(rootWizards);
    }
  };
  const clearHistory = () => {
    setHistory({ ids: [], entities: {} });
    localStorage.removeItem('chat_session_id');
    if (socketRef.current) {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
      socketRef.current = null;
    }
    const newSessionId = getSessionId();
    connectSocket(newSessionId);
    setHistory({ ids: [], entities: {} });
    if (rootWizards.length > 0) {
      setCurrentWizards(rootWizards);
    } else {
      loadRootWizards();
    }
    console.log('Chat history cleared and session reset successfully');
  };

  // Context value
  const value = {
    isConnected,
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
    sendUploadedImage,
    sendData,
    setService,
    handleWizardSelect,
    addNewMessage,
    updateMessage,
    removeMessage,
    clearHistory,
    registerSocketOnOpenHandler,
    registerSocketOnCloseHandler,
    registerSocketOnErrorHandler,
    registerSocketOnMessageHandler,
    disconnectChatSocket,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);
