import { BrushCleaning, LucideAudioLines } from 'lucide-react';
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
import Swal from 'sweetalert2';

const Chat = ({ services = null }) => {
  const [question, setQuestion] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [loadingCaption, setLoadingCaption] = useState('null');
  const [initialLayout, setInitialLayout] = useState(true); // حالت جدید برای کنترل چیدمان اولیه
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
    isConnected,
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
    clearHistory,
    chatContainerRef,
    chatEndRef,
    sendMessage,
    setService,
    handleWizardSelect,
    registerSocketOnCloseHandler,
    registerSocketOnErrorHandler,
    registerSocketOnMessageHandler,
  } = useChat();

  /**
   * Setup service
   */
  useEffect(() => {
    if (isConnected && services)
      Object.keys(services).forEach((name) => setService(name, services[name]));
  }, [isConnected]);

  // Effect برای تغییر چیدمان وقتی اولین پیام ارسال می‌شود
  useEffect(() => {
    if (history.ids.length > 0 && initialLayout) {
      setInitialLayout(false);
    }
  }, [history.ids.length, initialLayout]);

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
      notify.error('مشکلی پیش آمده لطفا بعدا تلاش نمایید.', {
        autoClose: 4000,
        position: 'top-left',
      });
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

  const handleClearHistory = async () => {
    if (history.ids.length === 0) return;

    const result = await Swal.fire({
      title: 'آیا مطمئن هستید؟',
      text: 'آیا از پاک کردن تمام تاریخچه چت مطمئن هستید؟ این عمل قابل بازگشت نیست.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'بله، پاک کن!',
      cancelButtonText: 'لغو',
      customClass: {
        confirmButton: 'swal2-confirm-btn',
        cancelButton: 'swal2-cancel-btn',
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      clearHistory();
      setInitialLayout(true); // اگر خواستید صفحه اولیه دوباره بیاد
      Swal.fire({
        title: 'پاک شد!',
        text: 'تاریخچه چت با موفقیت پاک شد.',
        icon: 'success',
        confirmButtonText: 'باشه',
        customClass: {
          confirmButton: 'swal2-ok-btn',
        },
        buttonsStyling: false,
      });
    }
  };

  return (
    <div className="flex flex-col overflow-x-hidden pt-9 pb-7 px-2 h-full w-full max-w-[860px] mx-auto">
      {/* حالت اولیه - قبل از ارسال اولین پیام */}
      {initialLayout && history.ids.length === 0 && !historyLoading && (
        <div className="flex flex-col items-center justify-center h-full space-y-8 transition-all duration-500">
          {/* عنوان خوشامدگویی */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
              چطور می‌تونم کمکتون کنم؟ 😊🚀🌟
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              سوالات خود را بپرسید تا به بهترین شکل پاسخ دهم
            </p>
          </div>

          {/* اینپوت در مرکز */}
          <div className="w-full max-w-2xl mx-auto">
            <div className="flex items-end justify-center overflow-hidden w-full max-h-[200vh] min-h-12 px-2 bg-gray-50 dark:bg-gray-900 gap-2 rounded-3xl shadow-lg border">
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
                centerAlign={true}
              />
              <div
                className={`max-w-60 flex items-center justify-center gap-2 mb-[9px] ${
                  question.trim() ? 'hidden' : ''
                }`}
              >
                <VoiceBtn onTranscribe={setQuestion} />
                {/*<button*/}
                {/*  onClick={() => navigate('/voice-agent')}*/}
                {/*  className="bg-blue-200 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-blue-300 p-1.5 rounded-full"*/}
                {/*>*/}
                {/*  <LucideAudioLines size={22} />*/}
                {/*</button>*/}
              </div>
            </div>

            {/* ویزارد باتن‌ها در زیر اینپوت */}
            <div className="mt-6">
              <WizardButtons
                onWizardSelect={handleWizardSelect}
                wizards={currentWizards}
              />
            </div>
          </div>
        </div>
      )}

      {/* حالت عادی - بعد از ارسال اولین پیام */}
      {!initialLayout && (
        <>
          <div
            ref={chatContainerRef}
            className="flex-1 scrollbar-hidden overflow-y-auto mb-4 space-y-4 transition-all duration-500"
            style={{ height: 'calc(100vh - 200px)' }}
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

          {/* Chat input */}
          {!optionMessageTriggered && (
            <>
              {/* Wizard buttons */}
              <WizardButtons
                onWizardSelect={handleWizardSelect}
                wizards={currentWizards}
              />
              <div className="flex items-center w-full max-h-[200vh] min-h-12 px-2 bg-gray-50 dark:bg-gray-900 gap-2 rounded-3xl shadow-lg border transition-all duration-500">
                {/* دکمه ارسال */}
                <button
                  onClick={() => sendMessageDecorator(question)}
                  onKeyDown={() => sendMessageDecorator(question)}
                  disabled={chatLoading || !question.trim()}
                  className="p-2 text-blue-600 disabled:text-gray-400 rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-6 h-6 bg-transparent"
                    fill="#2663eb"
                    viewBox="0 0 24 24"
                  >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>

                {/* اینپوت */}
                <TextInputWithBreaks
                  value={question}
                  onChange={setQuestion}
                  onSubmit={() => sendMessageDecorator(question)}
                  disabled={chatLoading}
                  placeholder="سوال خود را بپرسید..."
                  className="flex-1"
                />

                {/* دکمه‌ها و VoiceBtn */}
                <div
                  className={`flex items-center gap-2 ${
                    question.trim() ? 'hidden' : ''
                  }`}
                >
                  <button
                    onClick={handleClearHistory}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    title="پاک کردن تاریخچه"
                  >
                    <BrushCleaning className="h-5 w-5" />
                  </button>

                  <VoiceBtn onTranscribe={setQuestion} />

                  {/* <button
      onClick={() => navigate("/voice-agent")}
      className="bg-blue-200 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-blue-300 p-1.5 rounded-full"
    >
      <LucideAudioLines size={22} />
    </button> */}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {error && <div className="text-red-500 mt-2 text-right">{error}</div>}
    </div>
  );
};

export default Chat;

