import { LucideAudioLines } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { FaRobot } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { notify } from '../../ui/toast';
import VoiceBtn from './VoiceBtn';
import { WizardButtons } from './Wizard/';
import TextInputWithBreaks from '../../ui/textArea';
import Message from '../ui/chat/message/Message';
import { useChat } from '../../contexts/ChatContext';

const Chat = ({ item }) => {
  const [question, setQuestion] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [loadingCaption, setLoadingCaption] = useState('null');
  const processingMessageId = useRef(null);
  const initialResponseTimeoutRef = useRef(null);
  const deltaTimeoutRef = useRef(null);

  // Internal variables (not stateful) - moved inside component
  const internalVarsRef = useRef({
    inCompatibleMessage: '',
    bufferedTable: '',
    isInsideTable: false,
  });

  const initialMessageAddedRef = useRef(false);

  // const navigate = useNavigate();

  const {
    addNewMessage,
    updateMessage,
    setError,
    historyLoading,
    hasMoreHistory,
    historyOffset,
    error,
    currentWizards,
    optionMessageTriggered,
    setOptionMessageTriggered,
    history,
    chatContainerRef,
    chatEndRef,
    sendMessage,
    handleWizardSelect,
    registerSocketOnCloseHandler,
    registerSocketOnErrorHandler,
    registerSocketOnMessageHandler,
  } = useChat();

  /** Clear all timeouts */
  const clearAllTimeouts = () => {
    if (initialResponseTimeoutRef.current) {
      clearTimeout(initialResponseTimeoutRef.current);
      initialResponseTimeoutRef.current = null;
    }
    if (deltaTimeoutRef.current) {
      clearTimeout(deltaTimeoutRef.current);
      deltaTimeoutRef.current = null;
    }
  };

  /** Reset chat state to initial values */
  const resetChatState = () => {
    setChatLoading(false);

    // Handle buffered table if chat was in middle of a table
    if (
      internalVarsRef.current.isInsideTable &&
      internalVarsRef.current.bufferedTable
    ) {
      const lastMessageId = history.ids[history.ids.length - 1];
      if (lastMessageId) {
        updateMessage(lastMessageId, {
          body: internalVarsRef.current.inCompatibleMessage,
        });
      }
    }

    // Reset internal variables
    internalVarsRef.current = {
      inCompatibleMessage: '',
      bufferedTable: '',
      isInsideTable: false,
    };
    initialMessageAddedRef.current = false;

    // Clear any pending timers
    clearAllTimeouts();
  };

  /** Register custom WebSocket event handlers */
  useEffect(() => {
    registerSocketOnCloseHandler(socketOnCloseHandler);
    registerSocketOnMessageHandler(socketOnMessageHandler);
    registerSocketOnErrorHandler(socketOnErrorHandler);

    return () => clearAllTimeouts();
  }, []);

  /** Update chat links to open in new tab */
  useEffect(() => {
    return renderMessageLinks();
  }, [history]);

  /** Scroll chat to bottom when loading changes */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLoading]);

  /** Add scroll listener to chat container */
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [historyLoading, hasMoreHistory, historyOffset]);

  /**
   * Reset loadingCaption state on chatLoading state change
   */
  useEffect(() => {
    setLoadingCaption(null);
  }, [chatLoading]);

  /**
   * Trigger scroll to button fuction on history loading or change history length
   */
  useEffect(() => {
    if (!historyLoading && history.ids.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [historyLoading, history.ids.length]);

  /** render chat messages links */
  const renderMessageLinks = () => {
    const timer = setTimeout(() => {
      const chatLinks = document.querySelectorAll('.chat-message a');
      chatLinks.forEach((link) => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      });
    }, 100);
    return () => clearTimeout(timer);
  };

  /** Trigger option message from assistant */
  const triggerOptionHandler = (optionInfo) => {
    const optionMessage = {
      type: 'option',
      role: 'assistant',
      metadata: optionInfo,
      created_at: new Date().toISOString().slice(0, 19),
    };
    addNewMessage(optionMessage);
    setOptionMessageTriggered(true);
  };

  /** Handle incoming WebSocket messages */
  const socketOnMessageHandler = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.event) {
        switch (data.event) {
          case 'loading':
            setChatLoading(true);
            break;
          case 'trigger':
            triggerOptionHandler(data);
            break;
          case 'call_function':
            handleCallFunctionEvent(data);
            break;
          case 'delta':
            handleDeltaResponse(data);
            break;
          case 'finished':
            finishMessageHandler();
            break;
          default:
            break;
        }
      }
    } catch (e) {
      console.log('Error on message event', e);
    }
  };

  /** Handle WebSocket close */
  const socketOnCloseHandler = () => resetChatState();

  /** Handle WebSocket errors */
  const socketOnErrorHandler = (event) => {
    console.error('WebSocket error:', event);
    setError('خطا در ارتباط با سرور');
    resetChatState();
  };

  /** Send message through socket and set 1-minute fallback timeout */
  const sendMessageDecorator = async (text) => {
    await sendMessage(text);
    setQuestion('');
    setError(null);

    // Clear any existing timers
    clearAllTimeouts();

    // Set fallback timeout for 1 minute
    initialResponseTimeoutRef.current = setTimeout(() => {
      // notify.error("مشکلی پیش آمده لطفا بعدا تلاش نمایید.", {
      //   autoClose: 4000,
      //   position: "top-left",
      // });
      resetChatState();
    }, 60000);
  };

  /** Scroll chat to bottom */
  const scrollToBottom = () => {
    if (chatEndRef.current)
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  /** Handle scroll event on chat container */
  const handleScroll = () => {
    if (!chatContainerRef.current || historyLoading || !hasMoreHistory) return;
  };

  /**
   * Handle call function event
   */
  const handleCallFunctionEvent = (data) => {
    setLoadingCaption(data.lable);
  };

  /**
   * Handles delta response buffers
   *
   * @param {object}
   * @returns null|object
   */
  const handleDeltaResponse = (data) => {
    if (!processingMessageId.current) {
      processingMessageId.current = addNewMessage({
        type: 'text',
        body: '',
        role: 'assistant',
        created_at: new Date().toISOString().slice(0, 19),
      });
    }

    // Reset 10-second delta timeout on each delta
    if (deltaTimeoutRef.current) clearTimeout(deltaTimeoutRef.current);
    deltaTimeoutRef.current = setTimeout(() => {
      resetChatState();
    }, 10000);

    const delta = data.message;
    internalVarsRef.current.inCompatibleMessage += delta;

    if (internalVarsRef.current.inCompatibleMessage.includes('<table')) {
      internalVarsRef.current.isInsideTable = true;
      internalVarsRef.current.bufferedTable += delta;
    } else if (internalVarsRef.current.isInsideTable) {
      internalVarsRef.current.bufferedTable += delta;
    } else {
      updateMessage(processingMessageId.current, {
        body: internalVarsRef.current.inCompatibleMessage,
      });
      return;
    }

    if (internalVarsRef.current.isInsideTable) {
      const openTableTags = (
        internalVarsRef.current.bufferedTable.match(/<table/g) || []
      ).length;
      const closeTableTags = (
        internalVarsRef.current.bufferedTable.match(/<\/table>/g) || []
      ).length;

      if (openTableTags === closeTableTags && openTableTags > 0) {
        updateMessage(processingMessageId.current, {
          body: internalVarsRef.current.inCompatibleMessage,
        });
        internalVarsRef.current.bufferedTable = '';
        internalVarsRef.current.isInsideTable = false;
      }
    }
  };

  /** Finalize assistant message */
  const finishMessageHandler = () => {
    setChatLoading(false);

    if (
      internalVarsRef.current.isInsideTable &&
      internalVarsRef.current.bufferedTable
    ) {
      updateMessage(processingMessageId.current, {
        body: internalVarsRef.current.inCompatibleMessage,
      });
      internalVarsRef.current.bufferedTable = '';
      internalVarsRef.current.isInsideTable = false;
    }

    processingMessageId.current = null;
    internalVarsRef.current.inCompatibleMessage = '';
    clearAllTimeouts();
  };

  return (
    <div className="flex flex-col overflow-x-hidden h-full pb-7 px-2 w-full max-w-[1220px] mx-auto relative">
      <div
        ref={chatContainerRef}
        className="scrollbar-hidden overflow-y-auto pb-11"
      >
        {/* Loading indicator for chat history */}
        {historyLoading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
            <p className="text-gray-600 dark:text-gray-300">
              در حال بارگذاری تاریخچه...
            </p>
          </div>
        )}

        {/* Empty state */}
        {history.ids.length === 0 && !historyLoading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 p-4">
            سوال خود را بپرسید تا گفتگو شروع شود
          </div>
        ) : (
          history.ids.map((id) => (
            <div
              key={id}
              className="mb-4 transition-[height] duration-300 ease-in-out grid"
            >
              <Message messageId={id} data={history.entities[id]} />
            </div>
          ))
        )}

        {/* Loading bot response */}
        {chatLoading && (
          <div className="text-white grid justify-end text-end">
            <div className="flex items-center justify-end p-1 gap-1 text-end">
              <small className="dark:text-gray-500 text-gray-400 mx-1 italic">
                {loadingCaption}
              </small>
              <BeatLoader size={9} color="#808080" className="ml-1" />
              <span className="p-1.5 rounded-lg shadow-lg dark:bg-[#202936] bg-white flex items-center justify-center">
                <FaRobot className="w-4 mb-1 dark:text-gray-300 text-gray-800" />
              </span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="absolute bottom-0 left-[1px] w-full">
        {/* Wizard buttons */}
        <WizardButtons
        onWizardSelect={handleWizardSelect}
        wizards={currentWizards}
      />

        {/* Chat input */}
        {!optionMessageTriggered && (
          <div className="flex items-end justify-end overflow-hidden w-full max-h-[200vh] min-h-12 px-2 bg-gray-50 dark:bg-gray-900 gap-2 rounded-3xl shadow-lg border">
            <button
              onClick={() => sendMessageDecorator(question)}
              onKeyDown={() => sendMessageDecorator(question)}
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
              onSubmit={() => sendMessageDecorator(question)}
              disabled={chatLoading}
              placeholder="سوال خود را بپرسید..."
            />
            <div
              className={`max-w-60 flex items-center justify-center gap-2 mb-[9px] p-[3.5px] ${
                question.trim() ? 'hidden' : ''
              }`}
            >
              <VoiceBtn onTranscribe={setQuestion} />
              {/* <button
                onClick={() => navigate('/voice-agent')}
                className="bg-blue-200 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-blue-300 rounded-full p-1"
              >
                <LucideAudioLines size={22} />
              </button> */}
            </div>
          </div>
        )}
      </div>
      {error && <div className="text-red-500 mt-2 text-right">{error}</div>}
    </div>
  );
};

export default Chat;
