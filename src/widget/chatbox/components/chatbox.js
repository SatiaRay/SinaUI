import styled from 'styled-components';
import Chat from '../../../components/Chat/Chat';
import { ChatProvider } from '../../../contexts/ChatContext';
import { SiChatbot } from 'react-icons/si';
import { IoClose } from 'react-icons/io5';
import { useState } from 'react';
import axios from 'axios';

const Box = styled.div`
  position: fixed;
  bottom: 2vh;
  left: 2vw;
  width: 28vw;
  height: 70vh;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: Vazir !important;
  z-index: 1000;
  transition: all 0.3s ease-in-out;
  max-width: 400px;
  max-height: 600px;

  /* 📱 Phones - Portrait */
  @media (max-width: 480px) {
    width: 95vw;
    height: 85vh;
    left: 2.5vw;
    bottom: 2vh;
    border-radius: 12px;
    max-width: none;
    max-height: none;
  }

  /* 📱 Phones - Landscape */
  @media (max-width: 896px) and (orientation: landscape) {
    width: 85vw;
    height: 90vh;
    left: 7.5vw;
    bottom: 2vh;
    max-width: none;
    max-height: none;
  }

  /* 📟 Small Tablets */
  @media (min-width: 481px) and (max-width: 768px) {
    width: 80vw;
    height: 75vh;
    left: 10vw;
    bottom: 2vh;
    max-width: 500px;
    max-height: 550px;
  }

  /* 📟 Tablets */
  @media (min-width: 769px) and (max-width: 1024px) {
    width: 65vw;
    height: 72vh;
    left: 5vw;
    bottom: 2vh;
    max-width: 500px;
    max-height: 550px;
  }

  /* 💻 Small laptops */
  @media (min-width: 1025px) and (max-width: 1440px) {
    width: 32vw;
    height: 68vh;
    max-width: 450px;
    max-height: 580px;
  }

  /* 🖥️ Large screens */
  @media (min-width: 1441px) {
    width: 26vw;
    height: 65vh;
    max-width: 450px;
    max-height: 600px;
  }
`;

const FullscreenBox = styled(Box)`
  width: 100vw !important;
  height: 100vh !important;
  bottom: 0 !important;
  left: 0 !important;
  border-radius: 0;
  max-width: none !important;
  max-height: none !important;
`;

const Header = styled.div`
  background-color: rgb(220, 20, 53);
  color: white;
  padding: 16px 20px;
  font-weight: bold;
  text-align: center;
  position: relative;
  font-size: 1.1rem;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    padding: 14px 16px;
    font-size: 1rem;
    min-height: 55px;
  }

  @media (max-width: 896px) and (orientation: landscape) {
    padding: 12px 16px;
    min-height: 50px;
    font-size: 0.95rem;
  }
`;

const Title = styled.div`
  font-family: Vazir;
  font-size: 1.1rem;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Messages = styled.div`
  flex: 1;
  padding: 16px;
  background-color: #f9f9f9;
  overflow-y: auto;
  font-size: 15px;

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 14px;
  }

  @media (max-width: 896px) and (orientation: landscape) {
    padding: 10px;
    font-size: 14px;
  }

  @media (min-width: 1441px) {
    padding: 20px;
    font-size: 16px;
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

  @media (max-width: 480px) {
    right: 12px;
    width: 28px;
    height: 28px;
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

  /* 📱 Mobile */
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    bottom: 4vh;
    left: 4vw;
  }

  /* 📱 Small Mobile */
  @media (max-width: 480px) {
    width: 56px;
    height: 56px;
    bottom: 5vh;
    left: 5vw;
  }
`;

const ChatBox = (props) => {
  const isStatic = props['static'];
  const [fullscreen, setFullscreen] = useState(props['fullscreen']);
  const [isVisible, setIsVisible] = useState(false);
  let services = null;

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
      <Header>
        {!isStatic && (
          <Close onClick={() => setIsVisible(false)}>
            <IoClose size={20} />
          </Close>
        )}
        <Title>چت‌بات خان 🤖</Title>
      </Header>
      <Messages>
        <ChatProvider>
          <Chat services={services} />
        </ChatProvider>
      </Messages>
    </>
  );

  return (
    <div id="khan-chatbox">
      {isVisible || isStatic ? (
        fullscreen ? (
          <FullscreenBox>{boxContent}</FullscreenBox>
        ) : (
          <Box>{boxContent}</Box>
        )
      ) : (
        <ChatBoxTrigger onClick={() => setIsVisible(true)}>
          <SiChatbot size={28} />
        </ChatBoxTrigger>
      )}
    </div>
  );
};

export default ChatBox;
