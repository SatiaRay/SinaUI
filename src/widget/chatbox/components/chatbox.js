import styled, { createGlobalStyle } from 'styled-components';
import Chat from '../../../components/Chat/Chat';
import { ChatProvider } from '../../../contexts/ChatContext';
import { SiChatbot } from 'react-icons/si';
import { IoClose } from 'react-icons/io5';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthProvider } from '../../../contexts/AuthContext';

const GlobalStyle = createGlobalStyle`
  body.chatbox-open {
    overflow: hidden;
    height: 100%;
    overscroll-behavior: contain;
    touch-action: none;
  }
`;

const Box = styled.div`
  position: fixed;
  bottom: 2vh;
  left: 2vw;
  width: 450px;
  height: 750px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: Vazir !important;
  z-index: 1000;
  transition: all 0.3s ease-in-out;

  @media (max-width: 768px) {
    width: 100vw !important;
    height: 100dvh !important;
    bottom: 0 !important;
    left: 0 !important;
    border-radius: 0;
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
`;

const Header = styled.div`
  background-color: rgb(220, 20, 53);
  color: white;
  padding: 16px 20px;
  font-weight: bold;
  text-align: center;
  position: sticky;
  top: 0;
  font-size: 1.1rem;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 20px;
    font-size: 1.2rem;
  }
`;

const Title = styled.div`
  font-family: Vazir;
`;

const Messages = styled.div`
  flex: 1;
  padding: 16px;
  background-color: #f9f9f9;
  overflow-y: auto;
  font-size: 15px;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Close = styled.div`
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    right: 20px;
    width: 36px;
    height: 36px;
  }
`;

const ChatBoxTrigger = styled.button`
  position: fixed;
  bottom: 3vh;
  left: 3vw;
  width: 70px;
  height: 70px;
  z-index: 100;
  color: white !important;
  background-color: #dc143c !important;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    bottom: 4vh;
    left: 4vw;
  }
`;

const ChatBox = (props) => {
  const isStatic = props['static'];
  const [fullscreen, setFullscreen] = useState(props['fullscreen'] || false);
  const [isVisible, setIsVisible] = useState(false);

  // useEffect باید همیشه اجرا بشه (بدون شرط بیرونی)
  useEffect(() => {
    if (isVisible || fullscreen) {
      document.body.classList.add('chatbox-open');
      setTimeout(() => {
        window.scrollTo(0, 1);
        document.documentElement.scrollTop = 1;
      }, 300);
    } else {
      document.body.classList.remove('chatbox-open');
    }

    return () => document.body.classList.remove('chatbox-open');
  }, [isVisible, fullscreen]);

  // بقیه متغیرها
  let services = null;

  // اگر accessToken وجود نداشت، فقط UI هشدار نشون بده، نه return قبل از هوک‌ها
  const hasAccessToken = !!props['accessToken'];

  if (hasAccessToken) {
    localStorage.setItem('khan-access-token', props['accessToken']);
  }

  if (props['token']) {
    delete axios.defaults.headers.common['Authorization'];
    axios.defaults.headers.common['Authorization'] = `Bearer ${props['token']}`;
  }

  if (props['satiaToken'] && props['satiaCustomer']) {
    services = {
      satia: {
        token: props['satiaToken'],
        customer: props['satiaCustomer'],
      },
    };
  }

  const boxContent = (
    <>
      <GlobalStyle />
      <Header>
        {!isStatic && (
          <Close
            onClick={() => {
              setIsVisible(false);
              setFullscreen(false);
            }}
          >
            <IoClose size={20} />
          </Close>
        )}
        <Title>چت‌بات خان 🤖</Title>
      </Header>
      <Messages>
        {hasAccessToken ? (
          <AuthProvider>
            <ChatProvider>
              <Chat services={services} />
            </ChatProvider>
          </AuthProvider>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            توکن دسترسی معتبر یافت نشد 🚫
          </div>
        )}
      </Messages>
    </>
  );

  return (
    <div id="khan-chatbox">
      {isVisible || isStatic || fullscreen ? (
        <Box>{boxContent}</Box>
      ) : (
        <ChatBoxTrigger
          onClick={() => {
            setIsVisible(true);
            setFullscreen(true);
          }}
        >
          <SiChatbot size={28} />
        </ChatBoxTrigger>
      )}
    </div>
  );
};

export default ChatBox;
