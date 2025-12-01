import { BrushCleaning, LucideAudioLines } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';
import { notify } from '../ui/toast';
import VoiceBtn from './VoiceBtn';
import { WizardButtons } from '../wizard';
import TextInputWithBreaks from '../ui/textArea';
import Message from '../ui/chat/message/Message';
import { useChat } from '@contexts/ChatContext';
import Swal from 'sweetalert2';
import { TypeAnimation } from 'react-type-animation';
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
  NormalLayoutSendButton,
  ActionButtonsContainer,
  ClearHistoryButton,
  ErrorMessage,
  H4,
} from '../ui/common';

/**
 * Optimized table parser with DOM stability
 * @class StableTableParser
 */
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

  /**
   * Reset parser state
   * @method reset
   */
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

  /**
   * Process delta content
   * @method processDelta
   * @param {string} delta - The delta content to process
   */
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

  /**
   * Handle HTML tags
   * @method handleTag
   * @param {string} tag - The HTML tag to handle
   * @returns {boolean} Whether the tag was processed
   */
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
        // Ignore other table-related tags for now
      } else {
        this.state.prefix += tag;
      }
      return true;
    }
  }

  /**
   * Finalize current row
   * @method finalizeCurrentRow
   */
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

  /**
   * Get stable HTML
   * @method getStableHTML
   * @returns {string} The stable HTML content
   */
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

  /**
   * Get complete HTML
   * @method getCompleteHTML
   * @returns {string} The complete HTML content
   */
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

  /**
   * Schedule stable update
   * @method scheduleStableUpdate
   */
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

  /**
   * Register update callback
   * @method onUpdate
   * @param {Function} callback - The callback function
   */
  onUpdate(callback) {
    this.updateCallbacks.push(callback);
  }

  /**
   * Force update
   * @method forceUpdate
   */
  forceUpdate() {
    const html = this.getStableHTML();
    this.updateCallbacks.forEach((callback) => callback(html));
    this.state.lastStableHTML = html;
  }

  /**
   * Get final HTML
   * @method getFinalHTML
   * @returns {string} The final HTML content
   */
  getFinalHTML() {
    return this.state.finalHTML || this.getCompleteHTML();
  }
}

/**
 * Main Chat Component
 * @component Chat
 * @param {Object} props - Component props
 * @param {Object} props.services - Chat services
 * @returns {JSX.Element} Chat component
 */
const Chat = ({ services = null }) => {
  const [question, setQuestion] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [loadingCaption, setLoadingCaption] = useState('null');
  const [initialLayout, setInitialLayout] = useState(true);
  const processingMessageId = useRef(null);
  const initialResponseTimeoutRef = useRef(null);
  const deltaTimeoutRef = useRef(null);
  const [isServiceUnavailable, setIsServiceUnabailable] = useState(false);

  // Refs for scroll management
  const tableParserRef = useRef(new StableTableParser());
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
    lastInputTypeRef,
    sendMessage,
    setService,
    handleWizardSelect,
    registerSocketOnCloseHandler,
    registerSocketOnErrorHandler,
    registerSocketOnMessageHandler,
    disconnectChatSocket,
  } = useChat();

  /**
   * Scroll to maximum possible bottom with 50% viewport space
   * @method scrollToMaxBottom
   */
  const scrollToMaxBottom = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    const attemptScroll = (attempt = 1) => {
      setTimeout(() => {
        // Method 1: Direct maximum scroll
        const maxScrollTop = container.scrollHeight - container.clientHeight;

        // Scroll to maximum possible position
        container.scrollTo({
          top: maxScrollTop,
          behavior: 'smooth',
        });

        // Double check and force if needed
        if (attempt < 2) {
          setTimeout(() => {
            // Force to absolute bottom
            const currentScroll = container.scrollTop;
            const currentMax = container.scrollHeight - container.clientHeight;

            if (currentScroll < currentMax - 10) {
              // If not at bottom (with 10px tolerance)
              container.scrollTo({
                top: currentMax,
                behavior: 'instant',
              });
            }
          }, 200);
        }
      }, attempt * 100);
    };

    attemptScroll(1);
  };

  /**
   * Force scroll to absolute bottom immediately
   * @method forceScrollToAbsoluteBottom
   */
  const forceScrollToAbsoluteBottom = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    const maxScroll = container.scrollHeight - container.clientHeight;
    container.scrollTo({
      top: maxScroll,
      behavior: 'instant',
    });

    // Double check for any rendering delays
    setTimeout(() => {
      const newMaxScroll = container.scrollHeight - container.clientHeight;
      if (container.scrollTop < newMaxScroll - 10) {
        container.scrollTo({
          top: newMaxScroll,
          behavior: 'instant',
        });
      }
    }, 50);
  };

  /**
   * Disable container overflow
   */
  useEffect(() => {
    window.parent.postMessage({ type: 'CONTAINER_OVERFLOW_HIDDEN' });
    return () => window.parent.postMessage({ type: 'CONTAINER_OVERFLOW_AUTO' });
  }, []);

  /**
   * Setup service
   */
  useEffect(() => {
    if (isConnected && services)
      Object.keys(services).forEach((name) => setService(name, services[name]));
  }, [isConnected]);

  /**
   * Change layout when first message is sent
   */
  useEffect(() => {
    if (history.ids.length > 0 && initialLayout) {
      setInitialLayout(false);
    }
  }, [history.ids.length, initialLayout]);

  /**
   * Clear all timeouts
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
    clearAllTimeouts();
  };

  /**
   * Setup table parser callbacks - FIXED VERSION
   */
  useEffect(() => {
    const parser = tableParserRef.current;

    // Check if onUpdate method exists before using it
    if (parser && typeof parser.onUpdate === 'function') {
      const handleParserUpdate = (html) => {
        if (processingMessageId.current) {
          Promise.resolve().then(() => {
            updateMessage(processingMessageId.current, { body: html });
          });
        }
      };

      parser.onUpdate(handleParserUpdate);

      return () => {
        // Safely remove callback
        if (parser.updateCallbacks) {
          parser.updateCallbacks = parser.updateCallbacks.filter(
            (cb) => cb !== handleParserUpdate
          );
        }
      };
    }
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
   * Auto scroll to bottom when history loads - SIMPLIFIED
   */
  useEffect(() => {
    if (
      !historyLoading &&
      history.ids.length > 0 &&
      !initialScrollDoneRef.current
    ) {
      const container = chatContainerRef.current;
      if (!container) return;

      // Directly scroll to bottom without any initial top scroll
      const scrollToBottom = () => {
        const maxScroll = container.scrollHeight - container.clientHeight;
        container.scrollTo({
          top: maxScroll,
          behavior: 'instant',
        });
        initialScrollDoneRef.current = true;
      };

      // Try immediately
      scrollToBottom();

      // Try again after a short delay to ensure DOM is ready
      const timer = setTimeout(scrollToBottom, 100);

      return () => clearTimeout(timer);
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
   * Reset loadingCaption state on chatLoading state change
   */
  useEffect(() => {
    setLoadingCaption(null);
  }, [chatLoading]);

  /**
   * Render chat messages links
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
   */
  const triggerOptionHandler = (optionInfo) => {
    const optionMessage = {
      type: 'option',
      role: 'assistant',
      metadata: optionInfo,
      fromWizard: true,
      created_at: new Date().toISOString().slice(0, 19),
    };
    addNewMessage(optionMessage);
    setOptionMessageTriggered(true);
  };

  /**
   * Handle incoming WebSocket messages
   */
  const socketOnMessageHandler = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('server message:', data);
      if (data.event) {
        switch (data.event) {
          case 'loading':
            setChatLoading(true);
            // Scroll to maximum bottom
            scrollToMaxBottom();
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
   * Handle WebSocket close
   */
  const socketOnCloseHandler = () => resetChatState();

  /**
   * Handle WebSocket errors
   */
  const socketOnErrorHandler = (event) => {
    console.error('WebSocket error:', event);
    setError('خطا در ارتباط با سرور');
    resetChatState();
  };

  /**
   * Send message through socket and set timeout
   */
  const sendMessageDecorator = async (text) => {
    await sendMessage(text);
    setQuestion('');
    setError(null);
    setChatLoading(true);

    // Scroll to maximum bottom after sending message
    scrollToMaxBottom();

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
   */
  const sendExceptionMessage = (msg = 'مشکلی پیش آمده است !') => {
    addNewMessage({
      type: 'error',
      body: msg,
      role: 'assistant',
      created_at: new Date().toISOString().slice(0, 19),
    });
  };

  /**
   * Handle call function event
   */
  const handleCallFunctionEvent = (data) => {
    setLoadingCaption(data.lable);
  };

  /**
   * Optimized delta response handler
   */
  const handleDeltaResponse = (data) => {
    try {
      if (!processingMessageId.current) {
        processingMessageId.current = addNewMessage({
          type: 'text',
          body: '',
          role: 'assistant',
          fromWizard: lastInputTypeRef.current === 'wizard',
          created_at: new Date().toISOString().slice(0, 19),
        });
      }
      if (deltaTimeoutRef.current) clearTimeout(deltaTimeoutRef.current);
      deltaTimeoutRef.current = setTimeout(() => {
        resetChatState();
      }, 10000);

      const delta = data.message || '';
      tableParserRef.current.processDelta(delta);

      // NO AUTO-SCROLL DURING STREAMING - per user request
    } catch (err) {
      console.error('handleDeltaResponse error', err);
    }
  };

  /**
   * Finalize assistant message
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
      // NO AUTO-SCROLL AT END - per user request
    }
  };

  /**
   * Handle clear history
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
    }
  };

  return (
    <ChatContainer>
      {/* Initial layout - before sending first message */}
      {initialLayout && history.ids.length === 0 && !historyLoading && (
        <InitialLayoutContainer>
          <WelcomeSection>
            <H3>
              سلام 👋 من سینا هوش مصنوعی {process.env.REACT_APP_NAME} هستم
            </H3>
            <H4>
              نام من به یاد ابن سینا نماد دانش و خرد ایرانی انتخاب شده است
            </H4>
            <WelcomeText aria-label="پیام خوش‌آمدگویی">
              <TypeAnimation
                sequence={[
                  'سوالات خود را بپرسید تا به بهترین شکل پاسخ دهم 😊🚀🌟',
                  1000,
                  'اینجا هستم تا سریع، دقیق و دوستانه کمکت کنم ✨',
                  1000,
                  'هر چیزی خواستی بپرس؛ با هم جلو می‌ریم 💡',
                  1000,
                ]}
                speed={50}
                deletionSpeed={100}
                repeat={Infinity}
                cursor={true}
                style={{ display: 'inline-block' }}
              />
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

      {/* Normal layout - after sending first message */}
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

            {/* Dynamic empty space based on chat container height */}
            <div
              style={{
                height: chatContainerRef.current
                  ? `${Math.max(100, chatContainerRef.current.clientHeight * 0.5)}px`
                  : '50vh', // Fallback
                minHeight: '100px',
                width: '100%',
                flexShrink: 0,
                pointerEvents: 'none', // Prevent interaction
              }}
            />
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

export default Chat;
