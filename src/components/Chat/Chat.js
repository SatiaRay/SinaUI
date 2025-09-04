import { LucideAudioLines } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { notify } from '../../ui/toast';
import VoiceBtn from './VoiceBtn';
import { WizardButtons } from './Wizard/';
import TextInputWithBreaks from '../../ui/textArea';
import Message from '../ui/chat/message/Message';
import { useChat } from '../../contexts/ChatContext';
import { copyToClipboard } from '../../utils/helpers';

const Chat = ({ item }) => {
  const [question, setQuestion] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const processingMessageId = useRef(null);
  const chatLoadingRef = useRef(chatLoading);
  const initialResponseTimeoutRef = useRef(null);
  const deltaTimeoutRef = useRef(null);

  const navigate = useNavigate();

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

  const initialMessageAddedRef = useRef(false);

  // Update chatLoadingRef whenever chatLoading changes
  useEffect(() => {
    chatLoadingRef.current = chatLoading;
  }, [chatLoading]);

  /**
   * Register custom chat socket event handlers
   */
  useEffect(() => {
    registerSocketOnCloseHandler(socketOnCloseHandler);
    registerSocketOnMessageHandler(socketOnMessageHandler);
    registerSocketOnErrorHandler(socketOnErrorHandler);
  }, []);

  useEffect(() => {
    return renderMessageLinks();
  }, [history]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLoading]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [historyLoading, hasMoreHistory, historyOffset]);

  /**
   * Trigger scroll to button fuction on history loading or change history length
   */
  useEffect(() => {
    if (!historyLoading && history.ids.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [historyLoading, history.ids.length]);

  /**
   * render chat messages links
   *
   * @returns function
   */
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

  /**
   * Handle trigger option event
   */
  const triggerOptionHandler = (optionInfo) => {
    const optionMessage = {
      type: 'option',
      role: 'assistance',
      metadata: optionInfo,
      created_at: new Date().toISOString().slice(0, 19),
    };
    addNewMessage(optionMessage);
    setOptionMessageTriggered(true);
  };

  /**
   * socket on message event handler
   * @param {object} event
   */
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
          case 'delta':
            handleDeltaResponse(event);
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

  /**
   * socket on close event handler
   * @param {object} event
   */
  const socketOnCloseHandler = (event) => {
    resetChatState();
  };

  /**
   * socket on error event handler
   * @param {object} event
   */
  const socketOnErrorHandler = (event) => {
    console.error('WebSocket error:', error);
    setError('خطا در ارتباط با سرور');
    resetChatState();
  };

  /** Reset chat state to initial state */
  const resetChatState = () => {
    setChatLoading(false);

    if (isInsideTable && bufferedTable) {
      const lastMessageId = history.ids[history.ids.length - 1];
      if (lastMessageId) {
        updateMessage(lastMessageId, {
          body: inCompatibleMessage,
        });
      }
      bufferedTable = '';
      isInsideTable = false;
    }

    inCompatibleMessage = '';
    initialMessageAddedRef.current = false;

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
   * Send message to the socket channel
   *
   * @param {String} text
   */
  const sendMessageDecorator = async (text) => {
    await sendMessage(text);
    setQuestion('');
    setError(null);

    initialMessageAddedRef.current = false;
    inCompatibleMessage = '';
    bufferedTable = '';
    isInsideTable = false;

    setChatLoading(true);

    // 1-minute timeout: If bot does not respond at all
    if (initialResponseTimeoutRef.current)
      clearTimeout(initialResponseTimeoutRef.current);
    initialResponseTimeoutRef.current = setTimeout(() => {
      notify.error('مشکلی پیش امده لطفا بعدا تلاش نمایید.', {
        autoClose: 4000,
        position: 'top-left',
      });
      resetChatState();
    }, 60000);

    // Clear delta timeout if any
    if (deltaTimeoutRef.current) {
      clearTimeout(deltaTimeoutRef.current);
      deltaTimeoutRef.current = null;
    }
  };

  // Internal variables (not stateful)
  let inCompatibleMessage = '';
  let bufferedTable = '';
  let isInsideTable = false;

  /**
   * Scroll chat history to bottom to display end message
   */
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (!chatContainerRef.current || historyLoading || !hasMoreHistory) return;
  };

  /**
   * Handles delta response buffers
   *
   * @param {object} event
   * @returns null|object
   */
  const handleDeltaResponse = (event) => {
    const data = JSON.parse(event.data);

    if (!processingMessageId.current) {
      const messageId = addNewMessage({
        type: 'text',
        body: '',
        role: 'assistant',
        created_at: new Date().toISOString().slice(0, 19),
      });

      processingMessageId.current = messageId;
    }

    // Reset 10-second delta timeout on each delta
    if (deltaTimeoutRef.current) clearTimeout(deltaTimeoutRef.current);
    deltaTimeoutRef.current = setTimeout(() => {
      resetChatState(); // 10-second timeout between deltas
    }, 10000);

    let delta = data.message;
    inCompatibleMessage += delta;
    if (inCompatibleMessage.includes('<table')) {
      isInsideTable = true;
      bufferedTable += delta;
    } else if (isInsideTable) {
      bufferedTable += delta;
    } else {
      updateMessage(processingMessageId.current, {
        body: inCompatibleMessage,
      });
      return;
    }
    if (isInsideTable) {
      const openTableTags = (bufferedTable.match(/<table/g) || []).length;
      const closeTableTags = (bufferedTable.match(/<\/table>/g) || []).length;
      if (openTableTags === closeTableTags && openTableTags > 0) {
        updateMessage(processingMessageId.current, {
          body: inCompatibleMessage,
        });
        bufferedTable = '';
        isInsideTable = false;
      } else {
        const openTrTags = (bufferedTable.match(/<tr>/g) || []).length;
        const closeTrTags = (bufferedTable.match(/<\/tr>/g) || []).length;
        if (openTrTags > closeTrTags) {
          const lastOpenTrIndex = bufferedTable.lastIndexOf('<tr>');
          if (lastOpenTrIndex !== -1) {
            const partialMessage = bufferedTable.substring(0, lastOpenTrIndex);
            updateMessage(processingMessageId.current, {
              body: inCompatibleMessage.replace(bufferedTable, partialMessage),
            });
          }
          return;
        }
        const lastCompleteRowIndex = bufferedTable.lastIndexOf('</tr>');
        if (lastCompleteRowIndex !== -1) {
          const partialTable = bufferedTable.substring(
            0,
            lastCompleteRowIndex + 5
          );
          updateMessage(processingMessageId.current, {
            body: inCompatibleMessage.replace(bufferedTable, partialTable),
          });
        }
      }
    }
  };

  /**
   * Handle message finished event
   */
  const finishMessageHandler = () => {
    processingMessageId.current = null;
    setChatLoading(false);
    if (isInsideTable && bufferedTable) {
      updateMessage(processingMessageId.current, { body: inCompatibleMessage });
      bufferedTable = '';
      isInsideTable = false;
    }
    inCompatibleMessage = '';

    // Clear timeouts
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
   * Copy answer message text to device clipboard
   *
   * @param {string} textToCopy
   * @param {string} messageId
   */
  const handleCopyAnswer = (textToCopy, messageId) => {
    const temp = document.createElement('div');
    temp.innerHTML = textToCopy;
    const plainText = temp.textContent || temp.innerText || '';
    copyToClipboard(plainText)
      .then(() => {
        notify.success('متن کپی شد!', {
          autoClose: 1000,
          position: 'top-left',
        });
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  };

  return (
    <div className="flex flex-col overflow-x-hidden h-screen md:p-7 pt-9 pb-7 px-2 w-full max-w-[1220px] mx-auto">
      <div
        ref={chatContainerRef}
        className="flex-1 scrollbar-hidden overflow-y-auto mb-4 space-y-4"
        style={{ height: 'calc(100vh - 200px)' }}
      >
        {historyLoading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
            <p className="text-gray-600 dark:text-gray-300">
              در حال بارگذاری تاریخچه...
            </p>
          </div>
        )}

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
              <Message
                messageId={id}
                data={history.entities[id]}
                onCopyAnswer={handleCopyAnswer}
              />
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
            className={`max-w-60 flex items-center justify-center gap-2 mb-[9px] ${
              question.trim() ? 'hidden' : ''
            }`}
          >
            <VoiceBtn onTranscribe={setQuestion} />
            <button
              onClick={() => navigate('/voice-agent')}
              className="bg-blue-200 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-blue-300 p-1.5 rounded-full"
            >
              <LucideAudioLines size={22} />
            </button>
          </div>
        </div>
      )}
      {error && <div className="text-red-500 mt-2 text-right">{error}</div>}
    </div>
  );
};

export default Chat;
