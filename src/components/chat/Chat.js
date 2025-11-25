import { BrushCleaning, LucideAudioLines } from 'lucide-react';
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { FaRobot } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';
import { notify } from '../ui/toast';
import VoiceBtn from './VoiceBtn';
import { WizardButtons } from '../wizard';
import TextInputWithBreaks from '../ui/textArea';
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
      finalHTML: '', // اضافه کردن برای نگهداری HTML نهایی
    };

    this.updateCallbacks = [];
    this.rafId = null;
    this.lastUpdateTime = 0;
    this.updateThreshold = 0; // ms between updates
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
        // Handle HTML tags
        const tagEnd = this.state.buffer.indexOf('>', i);
        if (tagEnd === -1) break; // Incomplete tag

        const fullTag = this.state.buffer.slice(i, tagEnd + 1);
        i = tagEnd + 1;

        if (this.handleTag(fullTag)) {
          processed += fullTag;
        } else {
          // Tag was handled internally, don"t add to processed
          continue;
        }
      } else {
        // Handle text content
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
      return false; // Don"t add to processed
    } else if (lowerTag === '</table>') {
      this.finalizeCurrentRow();
      this.state.isInTable = false;
      // ذخیره HTML نهایی وقتی جدول کامل شد
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
      // Other tags
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
    // اگر HTML نهایی وجود دارد، از آن استفاده کن
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

  // تابع جدید برای گرفتن HTML کامل
  getCompleteHTML() {
    let html = this.state.prefix;

    if (this.state.tableOpenTag) {
      html += this.state.tableOpenTag + '<tbody>';
      html += this.state.completedRows.join('');

      // اضافه کردن ردیف جاری اگر وجود دارد
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

  // تابع جدید برای گرفتن HTML نهایی
  getFinalHTML() {
    return this.state.finalHTML || this.getCompleteHTML();
  }
}

const Chat = ({ services = null }) => {
  const [question, setQuestion] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [loadingCaption, setLoadingCaption] = useState('null');
  const [initialLayout, setInitialLayout] = useState(true);
  const processingMessageId = useRef(null);
  const initialResponseTimeoutRef = useRef(null);
  const deltaTimeoutRef = useRef(null);
  const [isServiceUnavailable, setIsServiceUnabailable] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
  
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // استفاده از parser بهینه شده
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

  // رف برای کنترل اسکرول اولیه
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
      // استفاده از HTML نهایی قبل از ریست
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

  /** Setup table parser callbacks */
  useEffect(() => {
    const parser = tableParserRef.current;

    const handleParserUpdate = (html) => {
      if (processingMessageId.current) {
        // استفاده از microtask برای کاهش layout thrashing
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

  /** Register custom WebSocket event handlers */
  useEffect(() => {
    registerSocketOnCloseHandler(socketOnCloseHandler);
    registerSocketOnMessageHandler(socketOnMessageHandler);
    registerSocketOnErrorHandler(socketOnErrorHandler);

    return () => {
      clearAllTimeouts();
      tableParserRef.current.reset();
    };
  }, []);

  /** Scroll stabilization */
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
          // user returned to bottom while stream is active -> follow stream
          smartScrollToBottom();
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  /** Smart scroll to bottom */
  const forceScrollToBottomImmediate = () => {
    const container = chatContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight - container.clientHeight;
  };

  const smartScrollToBottom = () => {
    const container = chatContainerRef.current;
    const stabilizer = scrollStabilizerRef.current;
    if (!container) return;

    const threshold = autoScrollStateRef.current.threshold; // فاصله حساس از پایین
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (distanceFromBottom > threshold) return; // only scroll when near bottom

    if (!autoScrollStateRef.current.autoEnabled) return;

    if (stabilizer.isUserScrolling) return;

    const start = container.scrollTop;
    const end = container.scrollHeight - container.clientHeight;
    const duration = 400; // مدت زمان انیمیشن (میلی‌ثانیه)
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

  // اسکرول نرم به آخرین پیام هنگام بارگذاری اولیه
  const smoothScrollToBottom = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    const start = container.scrollTop;
    const end = container.scrollHeight - container.clientHeight;

    // اگر محتوایی برای اسکرول وجود ندارد، برگرد
    if (end <= 0) return;

    const duration = 800; // افزایش مدت زمان انیمیشن
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
        // وقتی انیمیشن تمام شد، مطمئن شو که دقیقاً به پایین اسکرول شده
        container.scrollTop = container.scrollHeight - container.clientHeight;
      }
    };

    requestAnimationFrame(animate);
  };

  // Effect برای اسکرول به ابتدا هنگام بارگذاری اولیه و سپس اسکرول نرم به انتها
  useEffect(() => {
    if (
      !historyLoading &&
      history.ids.length > 0 &&
      !initialScrollDoneRef.current
    ) {
      console.log('Starting initial scroll sequence...');

      const container = chatContainerRef.current;
      if (!container) {
        console.log('Container not found, retrying...');
        return;
      }

      // ابتدا به بالا اسکرول کنید
      console.log('Scrolling to top...');
      container.scrollTop = 0;

      // چندین تایمر با تاخیرهای مختلف برای اطمینان از اجرا
      const timer1 = setTimeout(() => {
        console.log('First scroll attempt after 300ms');
        smoothScrollToBottom();
      }, 300);

      const timer2 = setTimeout(() => {
        console.log('Second scroll attempt after 800ms');
        smoothScrollToBottom();
        initialScrollDoneRef.current = true;
      }, 800);

      const timer3 = setTimeout(() => {
        console.log('Final scroll attempt after 1500ms');
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

  // Effect جایگزین برای مواقعی که effect اصلی کار نمی‌کند
  useEffect(() => {
    if (
      !historyLoading &&
      history.ids.length > 0 &&
      !initialScrollDoneRef.current
    ) {
      console.log('Alternative scroll effect triggered');

      const attemptScroll = (attempt = 1) => {
        const container = chatContainerRef.current;
        if (container && container.scrollHeight > container.clientHeight) {
          console.log(`Scroll attempt ${attempt}, container ready`);

          // ابتدا به بالا
          container.scrollTop = 0;

          // سپس با تاخیر به پایین
          setTimeout(() => {
            smoothScrollToBottom();
            initialScrollDoneRef.current = true;
          }, 500);
        } else if (attempt < 5) {
          // اگر هنوز آماده نیست، دوباره تلاش کن
          console.log(
            `Container not ready, retrying in 200ms (attempt ${attempt})`
          );
          setTimeout(() => attemptScroll(attempt + 1), 200);
        } else {
          // اگر بعد از 5 بار تلاش نشد، مستقیم به پایین برو
          console.log('Max attempts reached, forcing scroll to bottom');
          forceScrollToBottomImmediate();
          initialScrollDoneRef.current = true;
        }
      };

      attemptScroll();
    }
  }, [historyLoading, history.ids.length]);

  // Effect برای ریست کردن وضعیت اسکرول اولیه وقتی تاریخچه پاک می‌شود
  useEffect(() => {
    if (history.ids.length === 0) {
      initialScrollDoneRef.current = false;
    }
  }, [history.ids.length]);

  /** Update chat links to open in new tab */
  useEffect(() => {
    return renderMessageLinks();
  }, [history]);

  /** Scroll chat to bottom when loading changes */
  useEffect(() => {
    if (chatLoading) {
      autoScrollStateRef.current.streaming = true;
      setTimeout(smartScrollToBottom, 50);
    } else {
      // when streaming stops, ensure we land at bottom and re-enable auto
      autoScrollStateRef.current.streaming = false;
      autoScrollStateRef.current.autoEnabled = true;
      setTimeout(forceScrollToBottomImmediate, 50);
    }
  }, [chatLoading]);

  /**
   * Reset loadingCaption state on chatLoading state change
   */
  useEffect(() => {
    setLoadingCaption(null);
  }, [chatLoading]);

  /**
   * Trigger scroll to button function on history loading or change history length
   */
  useEffect(() => {
    if (
      !historyLoading &&
      history.ids.length > 0 &&
      initialScrollDoneRef.current
    ) {
      // For discrete updates (not streaming) always force immediate scroll
      if (!chatLoading) {
        setTimeout(() => {
          forceScrollToBottomImmediate();
        }, 100);
      } else {
        // If stream is active, respect autoEnabled/threshold logic
        setTimeout(smartScrollToBottom, 100);
      }
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
    // discrete message -> force scroll
    setTimeout(forceScrollToBottomImmediate, 20);
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

  /** Send message through socket and set 2-minute fallback timeout */
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
   * @param {string} msg Exception message
   */
  const sendExceptionMessage = (msg = 'مشکلی پیش آمده است !') => {
    addNewMessage({
      type: 'error',
      body: msg,
      role: 'assistant',
      created_at: new Date().toISOString().slice(0, 19),
    });
    // discrete message -> force scroll to show error
    setTimeout(forceScrollToBottomImmediate, 20);
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
          created_at: new Date().toISOString().slice(0, 19),
        });
      }
      if (deltaTimeoutRef.current) clearTimeout(deltaTimeoutRef.current);
      deltaTimeoutRef.current = setTimeout(() => {
        resetChatState();
      }, 10000);

      const delta = data.message || '';
      tableParserRef.current.processDelta(delta);

      // Scroll stabilization
      // during streaming we only auto-scroll when near bottom and autoEnabled
      autoScrollStateRef.current.streaming = true;
      smartScrollToBottom();
    } catch (err) {
      console.error('handleDeltaResponse error', err);
    }
  };

  /** Finalize assistant message */
  const finishMessageHandler = () => {
    setChatLoading(false);
    try {
      if (processingMessageId.current) {
        // استفاده از HTML نهایی قبل از ریست
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
      // stream finished -> ensure we show final content
      autoScrollStateRef.current.streaming = false;
      autoScrollStateRef.current.autoEnabled = true;
      setTimeout(forceScrollToBottomImmediate, 50);
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
      // after clearing history ensure bottom
      setTimeout(forceScrollToBottomImmediate, 50);
    }
  };

  return (
    <ChatContainer>
      {/* حالت اولیه - قبل از ارسال اولین پیام */}
      {initialLayout && history.ids.length === 0 && !historyLoading && (
        <InitialLayoutContainer>
          <WelcomeSection>
            <H3>سلام 👋 من سینا هوش مصنوعی {process.env.REACT_APP_NAME} هستم</H3>
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

      {/* حالت عادی - بعد از ارسال اولین پیام */}
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
                {/* رفرنس برای ابتدای چت */}
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

      {/* {error && <ErrorMessage>{error}</ErrorMessage>} */}
    </ChatContainer>
  );
};

export default Chat;
