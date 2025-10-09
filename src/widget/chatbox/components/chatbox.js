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

  /* 📱 موبایل‌ها */
  @media (max-width: 600px) {
    width: 90vw;
    height: 80vh;
    left: 5vw;
    bottom: 2vh;
    border-radius: 12px;
  }

  /* 📟 تبلت‌ها */
  @media (min-width: 601px) and (max-width: 1024px) {
    width: 60vw;
    height: 75vh;
    left: 5vw;
  }

  /* 💻 لپ‌تاپ‌های کوچک */
  @media (min-width: 1025px) and (max-width: 1440px) {
    width: 35vw;
    height: 70vh;
  }
`;

const FullscreenBox = styled(Box)`
  width: 100vw !important;
  height: 100vh !important;
  bottom: 0 !important;
  left: 0 !important;
  border-radius: 0;
`;

const Header = styled.div`
  background-color: rgb(220, 20, 53);
  color: white;
  padding: 15px;
  font-weight: bold;
  text-align: center;
  position: relative;
  font-size: 1rem;

  @media (max-width: 600px) {
    padding: 12px;
    font-size: 0.95rem;
  }
`;

const Title = styled.div`
  font-family: Vazir;
`;

const Messages = styled.div`
  flex: 1;
  padding: 12px;
  background-color: #f9f9f9;
  overflow-y: auto;
  font-size: 15px;

  @media (max-width: 600px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const ChatBoxTrigger = styled.button`
  position: fixed;
  bottom: 2vh;
  left: 2vw;
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
    bottom: 3vh;
    left: 3vw;
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
            <IoClose size={22} />
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
          <SiChatbot size={30} />
        </ChatBoxTrigger>
      )}
    </div>
  );
};

export default ChatBox;
