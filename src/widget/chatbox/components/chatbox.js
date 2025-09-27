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
  right: 2vw;
  width: 400px; /* 20% of viewport width */
  height: 700px; /* 40% of viewport height */
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: Arial, sans-serif;
`;

const FullscreenBox = styled(Box)`
  width: 100vw !important;
  height: 100vh !important;
  bottom: 0 !important;
  right: 0 !important;
  border-radius: 0;
`;

const Header = styled.div`
  background-color: rgb(220, 20, 53);
  color: white;
  padding: 15px;
  font-weight: bold;
  text-align: center;
  position: relative;
`;

const Title = styled.div`
  justify-self: center;
  font-family: vazir;
`;

const Messages = styled.div`
  flex: 1;
  padding: 12px;
  background-color: #f9f9f9;
  overflow-y: auto;
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
  right: 2vw;
  width: 70px;
  height: 70px;
  z-index: 100;
  color: white;
  background-color: #dc143c;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChatBox = (props) => {
  const isStatic = props['static'];
  const [fullscreen, setFullscreen] = useState(props['fullscreen']);
  const [isVisible, setIsVisible] = useState(false);
  let services = null;

  if (props['token']) {
    delete (axios.defaults.headers.common['Authorization'])
    axios.defaults.headers.common['Authorization'] = `Bearer ${props['token']}`;
  }

  if(props['satiaToken'] && props['satiaCustomer']){
    services = {
      satia: {
        token: props['satiaToken'],
        customer: props['satiaCustomer']
      }
    }
  }

  

  const boxContent = (
    <>
      <Header>
        {!isStatic && (
          <Close onClick={() => setIsVisible(false)}>
            <IoClose size={20} />
          </Close>
        )}
        <Title>چت بات خان 🤖</Title>
      </Header>
      <Messages>
          <ChatProvider>
            <Chat services={services}/>
          </ChatProvider>
      </Messages>
    </>
  );

  return (
    <>
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
    </>
  );
};

export default ChatBox;
