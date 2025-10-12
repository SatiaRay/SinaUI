// ChatBox.jsx
import styled from 'styled-components';
import Chat from '../../../components/Chat/Chat';
import { ChatProvider } from '../../../contexts/ChatContext';
import { SiChatbot } from 'react-icons/si';
import { IoClose } from 'react-icons/io5';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthProvider } from '../../../contexts/AuthContext';

const Box = styled.div`
  position: fixed;
  bottom: 30px;
  left: 30px;
  width: 450px;
  height: 750px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: Vazir, sans-serif !important;
  z-index: 1000;
  transition: all 0.3s ease-in-out;

  @media (max-width: 768px), (max-height: 780px) {
    width: 100vw;
    height: 100dvh;
    border-radius: 0;
    margin: 0;
    padding: 0;
    bottom: 0px !important;
    left: 0px !important;
  }
`;

const Header = styled.div`
  background-color: #1d3557;
  color: white;
  font-weight: bold;
  text-align: center;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
`;

const Title = styled.div`
  font-family: Vazir, sans-serif;
`;

const MessagesWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0 10px;
`;

const Close = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const ChatBoxTrigger = styled.button`
  position: fixed;
  bottom: 30px;
  left: 30px;
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

const FooterSpacer = styled.div``;

const ChatBox = (props) => {
  const isStatic = props['static'];
  const [isVisible, setIsVisible] = useState(false);
  const [fullscreen, setFullscreen] = useState(props['fullscreen'] || false);

  const hasAccessToken = !!props['accessToken'];

  // Disable body scroll when chatbox is open
  useEffect(() => {
    if (isVisible || fullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible, fullscreen]);

  if (hasAccessToken) {
    localStorage.setItem('khan-access-token', props['accessToken']);
  }

  let services = null;

  if (props['satiaToken'] && props['satiaCustomer']) {
    services = {
      satia: {
        token: props['satiaToken'],
        customer: props['satiaCustomer'],
      },
    };
  }

  return (
    <div id="khan-chatbox">
      <Box
        style={{
          display: isVisible || isStatic || fullscreen ? 'flex' : 'none',
        }}
      >
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

        <MessagesWrapper>
          <Messages>
            {hasAccessToken ? (
              <AuthProvider>
                <ChatProvider>
                  <Chat services={services} />
                </ChatProvider>
              </AuthProvider>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                Access token not found 🚫
              </div>
            )}
          </Messages>
        </MessagesWrapper>
      </Box>

      {!(isVisible || isStatic || fullscreen) && (
        <ChatBoxTrigger
          onClick={() => {
            setIsVisible(true);
            if (window.innerWidth <= 768) setFullscreen(true);
          }}
        >
          <SiChatbot size={28} />
        </ChatBoxTrigger>
      )}
    </div>
  );
};

export default ChatBox;
