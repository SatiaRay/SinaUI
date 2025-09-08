import styled from 'styled-components';
import Chat from '../../../components/Chat/Chat'
import { ChatProvider } from '../../../contexts/ChatContext';

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

const Header = styled.div`
  background-color: #2e0ad1ff;
  color: white;
  padding: 12px;
  font-weight: bold;
  text-align: center;
`;

const Messages = styled.div`
  flex: 1;
  padding: 12px;
  background-color: #f9f9f9;
  overflow-y: auto;
`;

const ChatBox = () => {
  return (
    <Box>
      <Header>چت بات خان 🤖</Header>
      <Messages>
        <ChatProvider>
          <Chat/>
        </ChatProvider>
      </Messages>
    </Box>
  );
};

export default ChatBox;
