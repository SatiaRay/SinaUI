// ChatBox.jsx
import styled from 'styled-components';
import Chat from '../../../components/Chat/Chat';
import { ChatProvider } from '../../../contexts/ChatContext';
import { SiChatbot } from 'react-icons/si';
import { IoClose } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Box = styled.div`
  position: fixed;
  bottom: 2vh;
  left: 2vw;
  width: 400px; /* 20% of viewport width */
  height: 700px; /* 40% of viewport height */
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: Vazir !important;
  z-index: 1000;
`;

const FullscreenBox = styled(Box)`
  width: 100vw !important;
  height: 100dvh !important;
  bottom: 0 !important;
  right: 0 !important;
  border-radius: 0;
  z-index: 2000;
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    width: 100vw;
    height: 100dvh;
    right: 0;
    bottom: 0;
  }
`;

const Header = styled.div`
  background-color: #1d3557;
  color: white;
  padding: 12px 48px 12px 12px;
  font-weight: bold;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-shrink: 0;
  z-index: 1;
`;

const Title = styled.div`
  font-family: vazir, Arial, sans-serif;
  font-size: 16px;
  line-height: 1;
`;

const HeaderActions = styled.div`
  position: absolute;
  left: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Messages = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  padding: 0;
  background-color: #f9f9f9;
  overflow-y: auto;
  font-size: 15px;
`;

const CloseBtn = styled.button`
  position: relative;
  background: transparent;
  border: 0;
  color: white;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
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
  border: 0;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);

  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
  }
`;

const FooterSpacer = styled.div``;

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
        <HeaderActions>
          {!isStatic && (
            <CloseBtn
              aria-label="بستن چت"
              title="بستن"
              onClick={() => setIsVisible(false)}
            >
              <IoClose size={18} />
            </CloseBtn>
          )}
        </HeaderActions>

        <Title>چت بات خان 🤖</Title>
      </Header>

      <Messages>
        <ChatProvider>
          <Chat services={services} />
        </ChatProvider>
      </Messages>

      <FooterSpacer />
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
        <ChatBoxTrigger
          aria-label="باز کردن چت"
          title="باز کردن چت"
          onClick={() => setIsVisible(true)}
        >
          <SiChatbot size={28} />
        </ChatBoxTrigger>
      )}
    </div>
  );
};

export default ChatBox;
