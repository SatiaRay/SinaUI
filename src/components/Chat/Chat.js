import { BrushCleaning, LucideAudioLines } from 'lucide-react';
import React, {
  useEffect,
  useRef,
  useState,
  lazy,
  Suspense,
  useLayoutEffect,
} from 'react';
import { FaRobot } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';
import { notify } from '../../ui/toast';
import VoiceBtn from './VoiceBtn';
import { WizardButtons } from './Wizard/';
import TextInputWithBreaks from '../../ui/textArea';
import Message from '../ui/chat/message/Message';
import { useChat } from '@contexts/ChatContext';
import Swal from 'sweetalert2';
import {
  H2,
  H3,
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
  H4,
} from '../ui/common';
import { ChatSkeletonLoading } from './ChatSkeletonLoading';

// Optimized table parser with DOM stability
class StableTableParser {
  constructor() {
    this.state = {
      prefix: '',
      tableOpenTag: '',
      completedRows: [],
      currentRow: '',
      currentCell: '',
      isInCell: false,
      isInRow: false,
      isInTable: false,
      buffer: '',
      lastStableHTML: '',
      finalHTML: '',
    };

    this.updateCallbacks = [];
    this.rafId = null;
    this.lastUpdateTime = 0;
    this.updateThreshold = 0;
  }

  reset() {
    this.state = {
      prefix: '',
      tableOpenTag: '',
      completedRows: [],
      currentRow: '',
      currentCell: '',
      isInCell: false,
      isInRow: false,
      isInTable: false,
      buffer: '',
      lastStableHTML: '',
      finalHTML: '',
    };
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  processDelta(delta) {
    this.state.buffer += delta;

    let processed = '';
    let i = 0;

    while (i < this.state.buffer.length) {
      const char = this.state.buffer[i];

      if (char === '<') {
        const tagEnd = this.state.buffer.indexOf('>', i);
        if (tagEnd === -1) break;

        const fullTag = this.state.buffer.slice(i, tagEnd + 1);
        i = tagEnd + 1;

        if (this.handleTag(fullTag)) {
          processed += fullTag;
        } else {
          continue;
        }
      } else {
        if (this.state.isInCell) {
          this.state.currentCell += char;
        } else if (!this.state.isInTable) {
          this.state.prefix += char;
        }
        processed += char;
        i++;
      }
    }

    this.state.buffer = this.state.buffer.slice(i);
    this.scheduleStableUpdate();
  }

  handleTag(tag) {
    const lowerTag = tag.toLowerCase();

    if (lowerTag.startsWith('<table')) {
      this.state.isInTable = true;
      this.state.tableOpenTag = tag;
      return false;
    } else if (lowerTag === '</table>') {
      this.finalizeCurrentRow();
      this.state.isInTable = false;
      this.state.finalHTML = this.getCompleteHTML();
      this.scheduleStableUpdate();
      return true;
    } else if (lowerTag.startsWith('<tr')) {
      this.finalizeCurrentRow();
      this.state.isInRow = true;
      this.state.currentRow = tag;
      return false;
    } else if (lowerTag === '</tr>') {
      this.state.currentRow += '</tr>';
      this.state.completedRows.push(this.state.currentRow);
      this.state.currentRow = '';
      this.state.isInRow = false;
      this.scheduleStableUpdate();
      return false;
    } else if (lowerTag.startsWith('<td') || lowerTag.startsWith('<th')) {
      if (this.state.currentCell) {
        this.state.currentRow +=
          this.state.currentCell +
          `</${this.state.currentCell.startsWith('<td') ? 'td' : 'th'}>`;
      }
      this.state.currentCell = tag;
      this.state.isInCell = true;
      return false;
    } else if (lowerTag === '</td>' || lowerTag === '</th>') {
      this.state.currentCell += tag;
      this.state.currentRow += this.state.currentCell;
      this.state.currentCell = '';
      this.state.isInCell = false;
      this.scheduleStableUpdate();
      return false;
    } else {
      if (this.state.isInCell) {
        this.state.currentCell += tag;
      } else if (this.state.isInRow) {
        this.state.currentRow += tag;
      } else if (this.state.isInTable) {
      } else {
        this.state.prefix += tag;
      }
      return true;
    }
  }

  finalizeCurrentRow() {
    if (this.state.currentCell) {
      this.state.currentRow +=
        this.state.currentCell +
        `</${this.state.currentCell.startsWith('<td') ? 'td' : 'th'}>`;
      this.state.currentCell = '';
      this.state.isInCell = false;
    }
    if (this.state.currentRow) {
      if (!this.state.currentRow.endsWith('</tr>')) {
        this.state.currentRow += '</tr>';
      }
      this.state.completedRows.push(this.state.currentRow);
      this.state.currentRow = '';
      this.state.isInRow = false;
    }
  }

  getStableHTML() {
    if (this.state.finalHTML) {
      return this.state.finalHTML;
    }

    let html = this.state.prefix;

    if (this.state.isInTable) {
      html += this.state.tableOpenTag + '<tbody>';
      html += this.state.completedRows.join('');

      if (this.state.currentRow) {
        html += this.state.currentRow;
        if (this.state.currentCell) {
          html += this.state.currentCell;
        }
      }

      html += '</tbody></table>';
    }

    return html;
  }

  getCompleteHTML() {
    let html = this.state.prefix;

    if (this.state.tableOpenTag) {
      html += this.state.tableOpenTag + '<tbody>';
      html += this.state.completedRows.join('');

      if (this.state.currentRow) {
        html += this.state.currentRow;
        if (this.state.currentCell) {
          html +=
            this.state.currentCell +
            `</${this.state.currentCell.startsWith('<td') ? 'td' : 'th'}>`;
        }
        if (!this.state.currentRow.endsWith('</tr>')) {
          html += '</tr>';
        }
      }

      html += '</tbody></table>';
    }

    return html;
  }

  scheduleStableUpdate() {
    const now = Date.now();
    if (now - this.lastUpdateTime < this.updateThreshold) {
      return;
    }

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    this.rafId = requestAnimationFrame(() => {
      const currentHTML = this.getStableHTML();
      if (currentHTML !== this.state.lastStableHTML) {
        this.updateCallbacks.forEach((callback) => callback(currentHTML));
        this.state.lastStableHTML = currentHTML;
        this.lastUpdateTime = Date.now();
      }
      this.rafId = null;
    });
  }

  onUpdate(callback) {
    this.updateCallbacks.push(callback);
  }

  forceUpdate() {
    const html = this.getStableHTML();
    this.updateCallbacks.forEach((callback) => callback(html));
    this.state.lastStableHTML = html;
  }

  getFinalHTML() {
    return this.state.finalHTML || this.getCompleteHTML();
  }
}

/**
 * Main chat component with WebSocket integration
 * @param {Object} props - Component props
 * @param {Object} props.services - Available chat services
 */
const ChatInner = ({ services = null }) => {
  const [question, setQuestion] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [loadingCaption, setLoadingCaption] = useState('null');
  const [initialLayout, setInitialLayout] = useState(true);
  const processingMessageId = useRef(null);
  const initialResponseTimeoutRef = useRef(null);
  const deltaTimeoutRef = useRef(null);
  const [isServiceUnavailable, setIsServiceUnabailable] = useState(false);

  const tableParserRef = useRef(new StableTableParser());
  const scrollStabilizerRef = useRef({
    lastScrollTop: 0,
    isUserScrolling: false,
    stabilizeTimer: null,
  });

  const initialMessageAddedRef = useRef(false);
  const autoScrollStateRef = useRef({
    autoEnabled: true,
    streaming: false,
    threshold: 120,
  });
  const initialScrollDoneRef = useRef(false);
  const chatStartRef = useRef(null);

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
   * Setup service when connected
   */
  useEffect(() => {
    if (isConnected && services)
      Object.keys(services).forEach((name) => setService(name, services[name]));
  }, [isConnected]);

  /**
   * Switch to normal layout after first message
   */
  useEffect(() => {
    if (history.ids.length > 0 && initialLayout) {
      setInitialLayout(false);
    }
  }, [history.ids.length, initialLayout]);

  /**
   * Clear all active timeouts
   */
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

  /**
   * Reset chat state to initial values
   */
  const resetChatState = () => {
    setChatLoading(false);
    if (processingMessageId.current) {
      const finalHTML = tableParserRef.current.getFinalHTML();
      if (finalHTML) {
        updateMessage(processingMessageId.current, { body: finalHTML });
      }
    }
    tableParserRef.current.reset();
    processingMessageId.current = null;
    initialMessageAddedRef.current = false;
    clearAllTimeouts();
    autoScrollStateRef.current.streaming = false;
    autoScrollStateRef.current.autoEnabled = true;
  };

  /**
   * Setup table parser update callbacks
   */
  useEffect(() => {
    const parser = tableParserRef.current;

    const handleParserUpdate = (html) => {
      if (processingMessageId.current) {
        Promise.resolve().then(() => {
          updateMessage(processingMessageId.current, { body: html });
        });
      }
    };

    parser.onUpdate(handleParserUpdate);

    return () => {
      parser.updateCallbacks = parser.updateCallbacks.filter(
        (cb) => cb !== handleParserUpdate
      );
    };
  }, []);

  /**
   * Register custom WebSocket event handlers
   */
  useEffect(() => {
    registerSocketOnCloseHandler(socketOnCloseHandler);
    registerSocketOnMessageHandler(socketOnMessageHandler);
    registerSocketOnErrorHandler(socketOnErrorHandler);

    return () => {
      clearAllTimeouts();
      tableParserRef.current.reset();
    };
  }, []);

  /**
   * Setup scroll stabilization
   */
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const stabilizer = scrollStabilizerRef.current;
      stabilizer.lastScrollTop = container.scrollTop;
      stabilizer.isUserScrolling = true;

      if (stabilizer.stabilizeTimer) {
        clearTimeout(stabilizer.stabilizeTimer);
      }

      stabilizer.stabilizeTimer = setTimeout(() => {
        stabilizer.isUserScrolling = false;
      }, 100);

      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;

      if (distanceFromBottom > 20) {
        autoScrollStateRef.current.autoEnabled = false;
      } else if (distanceFromBottom <= 60) {
        autoScrollStateRef.current.autoEnabled = true;
        if (autoScrollStateRef.current.streaming) {
          smartScrollToBottom();
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Force immediate scroll to bottom
   */
  const forceScrollToBottomImmediate = () => {
    const container = chatContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight - container.clientHeight;
  };

  /**
   * Smart scroll to bottom with user behavior consideration
   */
  const smartScrollToBottom = () => {
    const container = chatContainerRef.current;
    const stabilizer = scrollStabilizerRef.current;
    if (!container) return;

    const threshold = autoScrollStateRef.current.threshold;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (distanceFromBottom > threshold) return;
    if (!autoScrollStateRef.current.autoEnabled) return;
    if (stabilizer.isUserScrolling) return;

    const start = container.scrollTop;
    const end = container.scrollHeight - container.clientHeight;
    const duration = 400;
    const startTime = performance.now();

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      container.scrollTop = start + (end - start) * eased;

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  /**
   * Smooth scroll to bottom with animation
   */
  const smoothScrollToBottom = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    const start = container.scrollTop;
    const end = container.scrollHeight - container.clientHeight;

    if (end <= 0) return;

    const duration = 800;
    const startTime = performance.now();

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      container.scrollTop = start + (end - start) * eased;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        container.scrollTop = container.scrollHeight - container.clientHeight;
      }
    };

    requestAnimationFrame(animate);
  };

  /**
   * Handle initial scroll sequence for chat history
   */
  useEffect(() => {
    if (
      !historyLoading &&
      history.ids.length > 0 &&
      !initialScrollDoneRef.current
    ) {
      const container = chatContainerRef.current;
      if (!container) return;

      container.scrollTop = 0;

      const timer1 = setTimeout(() => {
        smoothScrollToBottom();
      }, 300);

      const timer2 = setTimeout(() => {
        smoothScrollToBottom();
        initialScrollDoneRef.current = true;
      }, 800);

      const timer3 = setTimeout(() => {
        forceScrollToBottomImmediate();
        initialScrollDoneRef.current = true;
      }, 1500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [historyLoading, history.ids.length]);

  /**
   * Alternative scroll handling for edge cases
   */
  useEffect(() => {
    if (
      !historyLoading &&
      history.ids.length > 0 &&
      !initialScrollDoneRef.current
    ) {
      const attemptScroll = (attempt = 1) => {
        const container = chatContainerRef.current;
        if (container && container.scrollHeight > container.clientHeight) {
          container.scrollTop = 0;

          setTimeout(() => {
            smoothScrollToBottom();
            initialScrollDoneRef.current = true;
          }, 500);
        } else if (attempt < 5) {
          setTimeout(() => attemptScroll(attempt + 1), 200);
        } else {
          forceScrollToBottomImmediate();
          initialScrollDoneRef.current = true;
        }
      };

      attemptScroll();
    }
  }, [historyLoading, history.ids.length]);

  /**
   * Reset initial scroll state when history is cleared
   */
  useEffect(() => {
    if (history.ids.length === 0) {
      initialScrollDoneRef.current = false;
    }
  }, [history.ids.length]);

  /**
   * Update chat links to open in new tab
   */
  useEffect(() => {
    return renderMessageLinks();
  }, [history]);

  /**
   * Handle scroll behavior during chat loading
   */
  useEffect(() => {
    if (chatLoading) {
      autoScrollStateRef.current.streaming = true;
      setTimeout(smartScrollToBottom, 50);
    } else {
      autoScrollStateRef.current.streaming = false;
      autoScrollStateRef.current.autoEnabled = true;
      setTimeout(forceScrollToBottomImmediate, 50);
    }
  }, [chatLoading]);

  /**
   * Reset loading caption when chat loading state changes
   */
  useEffect(() => {
    setLoadingCaption(null);
  }, [chatLoading]);

  /**
   * Handle scroll behavior on history updates
   */
  useEffect(() => {
    if (
      !historyLoading &&
      history.ids.length > 0 &&
      initialScrollDoneRef.current
    ) {
      if (!chatLoading) {
        setTimeout(() => {
          forceScrollToBottomImmediate();
        }, 100);
      } else {
        setTimeout(smartScrollToBottom, 100);
      }
    }
  }, [historyLoading, history.ids.length, chatLoading]);

  /**
   * Render chat message links with target attributes
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
   * Trigger option message from assistant
   * @param {Object} optionInfo - Option metadata
   */
  const triggerOptionHandler = (optionInfo) => {
    const optionMessage = {
      type: 'option',
      role: 'assistant',
      metadata: optionInfo,
      created_at: new Date().toISOString().slice(0, 19),
    };
    addNewMessage(optionMessage);
    setOptionMessageTriggered(true);
    setTimeout(forceScrollToBottomImmediate, 20);
  };

  /**
   * Handle incoming WebSocket messages
   * @param {MessageEvent} event - WebSocket message event
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

  /**
   * Handle WebSocket connection close
   */
  const socketOnCloseHandler = () => resetChatState();

  /**
   * Handle WebSocket errors
   * @param {Event} event - WebSocket error event
   */
  const socketOnErrorHandler = (event) => {
    console.error('WebSocket error:', event);
    setError('خطا در ارتباط با سرور');
    resetChatState();
  };

  /**
   * Send message through WebSocket with timeout fallback
   * @param {string} text - Message text to send
   */
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
    }, 120000);
  };

  /**
   * Push exception message to chat history
   * @param {string} msg - Exception message text
   */
  const sendExceptionMessage = (msg = 'مشکلی پیش آمده است !') => {
    addNewMessage({
      type: 'error',
      body: msg,
      role: 'assistant',
      created_at: new Date().toISOString().slice(0, 19),
    });
    setTimeout(forceScrollToBottomImmediate, 20);
  };

  /**
   * Handle call function event from server
   * @param {Object} data - Function call data
   */
  const handleCallFunctionEvent = (data) => {
    setLoadingCaption(data.lable);
  };

  /**
   * Handle delta response from server
   * @param {Object} data - Delta response data
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
      tableParserRef.current.processDelta(delta);

      autoScrollStateRef.current.streaming = true;
      smartScrollToBottom();
    } catch (err) {
      console.error('handleDeltaResponse error', err);
    }
  };

  /**
   * Finalize assistant message processing
   */
  const finishMessageHandler = () => {
    setChatLoading(false);
    try {
      if (processingMessageId.current) {
        const finalHTML = tableParserRef.current.getFinalHTML();
        if (finalHTML) {
          updateMessage(processingMessageId.current, { body: finalHTML });
        }
        tableParserRef.current.forceUpdate();
      }
    } catch (err) {
      console.error('finishMessageHandler error', err);
    } finally {
      processingMessageId.current = null;
      tableParserRef.current.reset();
      clearAllTimeouts();
      autoScrollStateRef.current.streaming = false;
      autoScrollStateRef.current.autoEnabled = true;
      setTimeout(forceScrollToBottomImmediate, 50);
    }
  };

  /**
   * Handle chat history clearance with confirmation
   */
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
      buttonsStyling: true,
    });
    if (result.isConfirmed) {
      clearHistory();
      setInitialLayout(true);
      Swal.fire({
        title: 'پاک شد!',
        text: 'تاریخچه چت با موفقیت پاک شد.',
        icon: 'success',
        confirmButtonText: 'باشه',
        buttonsStyling: true,
      });
      setTimeout(forceScrollToBottomImmediate, 50);
    }
  };

  return (
    <ChatContainer>
      {initialLayout && history.ids.length === 0 && !historyLoading && (
        <InitialLayoutContainer>
          <WelcomeSection>
            <H3>
              سلام 👋 من سینا هوش مصنوعی {process.env.REACT_APP_NAME} هستم
            </H3>
            <H4>
              نام من به یاد ابن سینا نماد دانش و خرد ایرانی انتخاب شده است
            </H4>
            <WelcomeText>
              سوالات خود را بپرسید تا به بهترین شکل پاسخ دهم 😊🚀🌟
            </WelcomeText>
          </WelcomeSection>

          <InputContainer>
            <SendButton
              onClick={() => sendMessageDecorator(question)}
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
            </VoiceButtonContainer>
          </InputContainer>
          <WizardContainer>
            <WizardButtons
              onWizardSelect={handleWizardSelect}
              wizards={currentWizards}
            />
          </WizardContainer>
        </InitialLayoutContainer>
      )}

      {!initialLayout && (
        <>
          <ChatMessagesContainer ref={chatContainerRef}>
            {historyLoading && (
              <LoadingIndicator>
                <LoadingSpinner></LoadingSpinner>
                <LoadingText>در حال بارگذاری تاریخچه...</LoadingText>
              </LoadingIndicator>
            )}

            {history.ids.length === 0 && !historyLoading ? (
              <EmptyState>سوال خود را بپرسید تا گفتگو شروع شود</EmptyState>
            ) : (
              <>
                <div ref={chatStartRef} style={{ height: 0, width: '100%' }} />
                {history.ids.map((id) => (
                  <MessageContainer key={id}>
                    <Message messageId={id} data={history.entities[id]} />
                  </MessageContainer>
                ))}
              </>
            )}

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

          {!optionMessageTriggered && !isServiceUnavailable && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <WizardButtons
                  onWizardSelect={handleWizardSelect}
                  wizards={currentWizards}
                />
              </div>
              <InputContainer>
                <NormalLayoutSendButton
                  onClick={() => sendMessageDecorator(question)}
                  disabled={chatLoading || !question.trim()}
                >
                  <svg fill="#2663eb" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </NormalLayoutSendButton>

                <TextInputWithBreaks
                  value={question}
                  onChange={setQuestion}
                  onSubmit={() => sendMessageDecorator(question)}
                  disabled={chatLoading}
                  placeholder="سوال خود را بپرسید..."
                />

                <ActionButtonsContainer hidden={question.trim()}>
                  <ClearHistoryButton
                    onClick={handleClearHistory}
                    title="پاک کردن تاریخچه"
                  >
                    <BrushCleaning />
                  </ClearHistoryButton>
                  <VoiceBtn onTranscribe={setQuestion} />
                </ActionButtonsContainer>
              </InputContainer>
            </>
          )}
        </>
      )}
    </ChatContainer>
  );
};

/**
 * Lazy loading configuration for chat component
 */
const LAZY_LOAD_DELAY_MS = 500;

const ChatLazy = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ default: ChatInner });
      }, LAZY_LOAD_DELAY_MS);
    })
);

/**
 * Main chat component with Suspense wrapper
 * @param {Object} props - Component props
 * @param {Object} props.services - Available chat services
 */
const Chat = ({ services = null }) => {
  const { history } = useChat();

  return (
    <Suspense
      fallback={
        <ChatSkeletonLoading initialLayout={history.ids.length === 0} />
      }
    >
      <ChatLazy services={services} />
    </Suspense>
  );
};

export default Chat;
