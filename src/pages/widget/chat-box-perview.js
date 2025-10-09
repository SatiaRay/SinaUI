import ChatBox from '../../widget/chatbox/components/chatbox';
import '../../widget/chatbox/chatbox.css';

const ChatBoxPreview = () => {
  return (
    <ChatBox
      services={{
        satia: {
          token:
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjE2Ny4yNDE6ODAwM1wvXC91c2VyXC9sb2dpbiIsImlhdCI6MTc1NzU2MjY5NCwiZXhwIjoxNzYwMTU0Njk0LCJuYmYiOjE3NTc1NjI2OTQsImp0aSI6ImhOcHpjbFczbFZhS2JJZ04iLCJzdWIiOjIyMDEwLCJwcnYiOiI4YjQyMmU2ZjY1NzkzMmI4YWViY2IxYmYxZTM1NmRkNzZhMzY1YmYyIn0.sokzZ_Z8yohJVLX0VoHYZmUfmermumrlUw6uZds73XU',
          customer:
            'eyJTZXJpYWwiOjIyMDEwLCJNb2JpbGUiOiIwOTE4OTU1NzQ2NyIsIkFkc2xUZWwiOiIwODYzMzI4Mzg2MiIsIk5hbWUiOiLYudmE24wg2LnZhNmI24wg2KrYqNin2LEiLCJDdXN0b21lclR5cGUiOiJBIiwiU21zQ29kZSI6IjE3NTciLCJUeXBlIjoiQURTTCIsInN0YXR1cyI6W3siU2VyaWFsIjo2LCJOYW1lIjoi2KjZh9ix2Ycg2KjYsdiv2KfYsduMIiwiQnJhbmNoUmVmIjoiMSIsInBpdm90Ijp7IkN1c3RvbWVyUmVmIjoiMjIwMTAiLCJTdGF0dXNSZWYiOiI2IiwiQWN0aXZlIjoiMSIsIkRhdGUiOiIyMDI0LTA0LTE2IDAwOjAwOjAwIiwiQ29tbWVudCI6IkF1dG8ifX1dfQ==',
        },
      }}
      accessToken={process.env.REACT_APP_WIDGET_ACCESS_TOKEN}
    />
  );
};

export default ChatBoxPreview;
