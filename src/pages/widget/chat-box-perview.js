import ChatBox from '../../widget/chatbox/components/chatbox';
import '../../widget/chatbox/chatbox.css';

const ChatBoxPreview = () => {
  return (
    <ChatBox
      accessToken={process.env.REACT_APP_WIDGET_ACCESS_TOKEN}
      satiaToken={process.env.REACT_APP_SATIA_ACCESS_TOKEN}
      satiaCustomer={process.env.REACT_APP_SATIA_CUSTOMER}
    />
  );
};

export default ChatBoxPreview;
