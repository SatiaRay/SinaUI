import styled from 'styled-components';
import Chat from '../../../components/Chat/Chat';
import { ChatProvider } from '../../../contexts/ChatContext';
import { SiChatbot } from 'react-icons/si';
import { IoClose } from 'react-icons/io5';
import { useState, useEffect } from 'react';
import { AuthProvider } from '../../../contexts/AuthContext';

const Box = styled.div`
  position: fixed;
  top: ${(props) => (props.fullscreen ? '0' : 'auto')};
  bottom: ${(props) => (props.fullscreen ? '0' : '30px')};
  left: ${(props) => (props.fullscreen ? '0' : '30px')};
  right: ${(props) => (props.fullscreen ? '0' : 'auto')};
  width: ${(props) => (props.fullscreen ? '100vw' : '450px')};
  height: ${(props) => (props.fullscreen ? '100dvh' : '750px')};
  background-color: #fff;
  border-radius: ${(props) => (props.fullscreen ? '0' : '16px')};
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
    top: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
  }
`;

const Header = styled.div`
  background-color: rgb(220, 20, 53);
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

const ChatBox = (props) => {
  const {
    static: isStatic,
    fullscreen: fullscreenProp,
    accessToken,
    satiaToken,
    satiaCustomer,
    headeroff,
  } = props;

  const [isVisible, setIsVisible] = useState(false);
  const [fullscreen, setFullscreen] = useState(fullscreenProp || false);
  const hasAccessToken = !!accessToken;

  useEffect(() => {
    if (isVisible || fullscreen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => (document.body.style.overflow = '');
  }, [isVisible, fullscreen]);

  if (hasAccessToken) localStorage.setItem('khan-access-token', accessToken);

  let services = null;
  if (satiaToken && satiaCustomer)
    services = { satia: { token: satiaToken, customer: satiaCustomer } };

  return (
    <div id="khan-chatbox">
      <Box
        fullscreen={fullscreen}
        style={{
          display: isVisible || isStatic || fullscreen ? 'flex' : 'none',
        }}
      >
        {!headeroff && (
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
        )}
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

      {!isVisible && !isStatic && !fullscreen && (
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
