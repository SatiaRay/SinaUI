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
import {
  H2,
  ChatContainer,
  InitialLayoutContainer,
  WelcomeSection,
  WelcomeText,
  InputContainer,
  InputWrapper,
  SendButton,
  VoiceButtonContainer,
  WizardContainer,
  ChatMessagesContainer,
  LoadingIndicator,
  LoadingSpinner,
  LoadingText,
  EmptyState,
  MessageContainer,
  LoadingBotResponse,
  LoadingBotContainer,
  LoadingCaption,
  BotIconContainer,
  ChatEndRef,
  NormalLayoutInputWrapper,
  NormalLayoutSendButton,
  ActionButtonsContainer,
  ClearHistoryButton,
  ErrorMessage,
} from '../ui/common';

const Chat = ({ services = null }) => {
  const [question, setQuestion] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [loadingCaption, setLoadingCaption] = useState('null');
  const [initialLayout, setInitialLayout] = useState(true); // حالت جدید برای کنترل چیدمان اولیه
  const processingMessageId = useRef(null);
  const initialResponseTimeoutRef = useRef(null);
  const deltaTimeoutRef = useRef(null);
  const [isServiceUnavailable, setIsServiceUnabailable] = useState(false);

  const internalVarsRef = useRef({
    prefixHtml: '',
    tableOpenTag: '',
    tableBuffer: '',
    flushedRows: [],
    isInsideTable: false,
    lastPreview: '',
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
    disconnectChatSocket,
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
    if (processingMessageId.current) {
      try {
        const internal = internalVarsRef.current;
        let finalBody = internal.prefixHtml;
        if (internal.isInsideTable) {
          finalBody +=
            (internal.tableOpenTag || '<table>') +
            '<tbody>' +
            internal.flushedRows.join('') +
            internal.tableBuffer +
            '</tbody></table>';
        } else {
          finalBody += internal.tableBuffer;
        }
        updateMessage(processingMessageId.current, { body: finalBody });
      } catch (err) {
        console.error('resetChatState flush error', err);
      }
    }
    internalVarsRef.current = {
      prefixHtml: '',
      tableOpenTag: '',
      tableBuffer: '',
      flushedRows: [],
      isInsideTable: false,
      lastPreview: '',
    };
    processingMessageId.current = null;
    initialMessageAddedRef.current = false;
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
    setChatLoading(true);
    clearAllTimeouts();
    initialResponseTimeoutRef.current = setTimeout(() => {
      sendExceptionMessage('مشکلی پیش آمده لطفا بعدا تلاش نمایید.');
      setChatLoading(false);
      setIsServiceUnabailable(true);
      disconnectChatSocket();
      resetChatState();
    }, 60000);
  };

  /**
   * Push exception message to chat history
   * @param {string} msg Exception message
   */
  const sendExceptionMessage = (msg = 'مشکلی پیش آمده است !') => {
    addNewMessage({
      type: 'error',
      body: msg,
      role: 'assistant',
      created_at: new Date().toISOString().slice(0, 19),
    });
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
    try {
      if (!processingMessageId.current) {
        processingMessageId.current = addNewMessage({
          type: 'text',
          body: '',
          role: 'assistant',
          created_at: new Date().toISOString().slice(0, 19),
        });
      }
      if (deltaTimeoutRef.current) clearTimeout(deltaTimeoutRef.current);
      deltaTimeoutRef.current = setTimeout(() => {
        resetChatState();
      }, 10000);
      const delta = data.message || '';
      const internal = internalVarsRef.current;
      if (!internal.isInsideTable) {
        internal.prefixHtml += delta;
        const tableOpenMatch = internal.prefixHtml.match(/<table[^>]*>/i);
        if (tableOpenMatch) {
          const idx = internal.prefixHtml.search(/<table[^>]*>/i);
          internal.tableOpenTag = tableOpenMatch[0];
          internal.tableBuffer = internal.prefixHtml.slice(
            idx + internal.tableOpenTag.length
          );
          internal.prefixHtml = internal.prefixHtml.slice(0, idx);
          internal.isInsideTable = true;
        } else {
          if (processingMessageId.current) {
            const preview = internal.prefixHtml;
            if (internal.lastPreview !== preview) {
              updateMessage(processingMessageId.current, { body: preview });
              internal.lastPreview = preview;
            }
          }
          return;
        }
      } else {
        internal.tableBuffer += delta;
      }
      const trRegex = /<tr[\s\S]*?<\/tr>/gi;
      let match;
      let lastIndex = 0;
      const rows = [];
      while ((match = trRegex.exec(internal.tableBuffer)) !== null) {
        rows.push(match[0]);
        lastIndex = trRegex.lastIndex;
      }
      if (rows.length > 0) {
        internal.flushedRows.push(...rows);
        internal.tableBuffer = internal.tableBuffer.slice(lastIndex);
      }
      const tableClosed = /<\/table>/i.test(internal.tableBuffer);
      let previewHtml =
        internal.prefixHtml +
        (internal.tableOpenTag || '<table>') +
        '<tbody>' +
        internal.flushedRows.join('');
      if (tableClosed) {
        const beforeClose = internal.tableBuffer.replace(
          /<\/table>[\s\S]*$/i,
          ''
        );
        previewHtml += beforeClose + '</tbody></table>';
      } else {
        previewHtml += internal.tableBuffer + '</tbody></table>';
      }
      if (processingMessageId.current && internal.lastPreview !== previewHtml) {
        updateMessage(processingMessageId.current, { body: previewHtml });
        internal.lastPreview = previewHtml;
      }
    } catch (err) {
      console.error('handleDeltaResponse error', err);
    }
  };

  /** Finalize assistant message */
  const finishMessageHandler = () => {
    setChatLoading(false);
    try {
      const internal = internalVarsRef.current;
      if (processingMessageId.current) {
        if (!internal.isInsideTable) {
          updateMessage(processingMessageId.current, {
            body: internal.prefixHtml,
          });
        } else {
          const trRegex = /<tr[\s\S]*?<\/tr>/gi;
          let match;
          let lastIndex = 0;
          const extraRows = [];
          while ((match = trRegex.exec(internal.tableBuffer)) !== null) {
            extraRows.push(match[0]);
            lastIndex = trRegex.lastIndex;
          }
          if (extraRows.length) {
            internal.flushedRows.push(...extraRows);
            internal.tableBuffer = internal.tableBuffer.slice(lastIndex);
          }
          const remainingBeforeClose = internal.tableBuffer.replace(
            /<\/table>[\s\S]*$/i,
            ''
          );
          const finalHtml =
            internal.prefixHtml +
            (internal.tableOpenTag || '<table>') +
            '<tbody>' +
            internal.flushedRows.join('') +
            remainingBeforeClose +
            '</tbody></table>';
          updateMessage(processingMessageId.current, { body: finalHtml });
        }
      }
    } catch (err) {
      console.error('finishMessageHandler error', err);
    } finally {
      processingMessageId.current = null;
      internalVarsRef.current = {
        prefixHtml: '',
        tableOpenTag: '',
        tableBuffer: '',
        flushedRows: [],
        isInsideTable: false,
        lastPreview: '',
      };
      clearAllTimeouts();
    }
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
    <ChatContainer>
      {/* حالت اولیه - قبل از ارسال اولین پیام */}
      {initialLayout && history.ids.length === 0 && !historyLoading && (
        <InitialLayoutContainer>
          {/* عنوان خوشامدگویی */}
          <WelcomeSection>
            <H2>چطور می‌تونم کمکتون کنم؟ 😊🚀🌟</H2>
            <WelcomeText>
              سوالات خود را بپرسید تا به بهترین شکل پاسخ دهم
            </WelcomeText>
          </WelcomeSection>

          {/* اینپوت در مرکز */}
          <InputContainer>
            <SendButton
              onClick={() => sendMessageDecorator(question)}
              onKeyDown={() => sendMessageDecorator(question)}
              disabled={chatLoading || !question.trim()}
            >
              <svg fill="#2663eb" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </SendButton>
            <TextInputWithBreaks
              value={question}
              onChange={setQuestion}
              onSubmit={() => sendMessageDecorator(question)}
              disabled={chatLoading}
              placeholder="سوال خود را بپرسید..."
              centerAlign={true}
            />
            <VoiceButtonContainer hidden={question.trim()}>
              <VoiceBtn onTranscribe={setQuestion} />
              {/* <button
                  onClick={() => navigate('/voice-agent')}
                >
                  <LucideAudioLines size={22} />
                </button> */}
            </VoiceButtonContainer>
          </InputContainer>
          {/* ویزارد باتن‌ها در زیر اینپوت */}
          <WizardContainer>
            <WizardButtons
              onWizardSelect={handleWizardSelect}
              wizards={currentWizards}
            />
          </WizardContainer>
        </InitialLayoutContainer>
      )}

      {/* حالت عادی - بعد از ارسال اولین پیام */}
      {!initialLayout && (
        <>
          <ChatMessagesContainer ref={chatContainerRef}>
            {/* Loading indicator for chat history */}
            {historyLoading && (
              <LoadingIndicator>
                <LoadingSpinner></LoadingSpinner>
                <LoadingText>در حال بارگذاری تاریخچه...</LoadingText>
              </LoadingIndicator>
            )}

            {/* Empty state */}
            {history.ids.length === 0 && !historyLoading ? (
              <EmptyState>سوال خود را بپرسید تا گفتگو شروع شود</EmptyState>
            ) : (
              history.ids.map((id) => (
                <MessageContainer key={id}>
                  <Message messageId={id} data={history.entities[id]} />
                </MessageContainer>
              ))
            )}

            {/* Loading bot response */}
            {chatLoading && (
              <LoadingBotResponse>
                <LoadingBotContainer>
                  <LoadingCaption>{loadingCaption}</LoadingCaption>
                  <BeatLoader
                    size={9}
                    color="#808080"
                    style={{ marginLeft: '0.25rem' }}
                  />
                  <BotIconContainer>
                    <FaRobot />
                  </BotIconContainer>
                </LoadingBotContainer>
              </LoadingBotResponse>
            )}

            <ChatEndRef ref={chatEndRef} />
          </ChatMessagesContainer>

          {/* Chat input */}
          {!optionMessageTriggered && !isServiceUnavailable && (
            <>
              {/* Wizard buttons */}
              <div
                style={{
                  marginBottom: '10px',
                }}
              >
                <WizardButtons
                  onWizardSelect={handleWizardSelect}
                  wizards={currentWizards}
                />
              </div>
              <InputContainer>
                {/* دکمه ارسال */}
                <NormalLayoutSendButton
                  onClick={() => sendMessageDecorator(question)}
                  onKeyDown={() => sendMessageDecorator(question)}
                  disabled={chatLoading || !question.trim()}
                >
                  <svg fill="#2663eb" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </NormalLayoutSendButton>

                {/* اینپوت */}
                <TextInputWithBreaks
                  value={question}
                  onChange={setQuestion}
                  onSubmit={() => sendMessageDecorator(question)}
                  disabled={chatLoading}
                  placeholder="سوال خود را بپرسید..."
                />

                {/* دکمه‌ها و VoiceBtn */}
                <ActionButtonsContainer hidden={question.trim()}>
                  <ClearHistoryButton
                    onClick={handleClearHistory}
                    title="پاک کردن تاریخچه"
                  >
                    <BrushCleaning />
                  </ClearHistoryButton>

                  <VoiceBtn onTranscribe={setQuestion} />

                  {/* <button
      onClick={() => navigate("/voice-agent")}
    >
      <LucideAudioLines size={22} />
    </button> */}
                </ActionButtonsContainer>
              </InputContainer>
            </>
          )}
        </>
      )}

      {/* {error && <ErrorMessage>{error}</ErrorMessage>} */}
    </ChatContainer>
  );
};

export default Chat;
