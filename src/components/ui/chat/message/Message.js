import React from 'react';
import OptionMessage from './components/OptionMessage';
import ImageMessage from './components/ImageMessage';
import TextMessage from './components/TextMessage';
import SentMessage from './SentMessage';
import ReceivedMessage from './ReceivedMessage';
import { ErrorMessage } from './ErrorMessage';

const Message = ({ messageId, data }) => {
  // If created_at does not exist but timestamp exists
  let timestamp = data.created_at;
  if (!timestamp && data.timestamp) {
    const date = new Date(data.timestamp); // Assume timestamp is a Date object or milliseconds number
    timestamp = date.toISOString().split('.')[0]; // Remove milliseconds, format: "YYYY-MM-DDTHH:MM:SS"
  }
  const messageWrapper = (msgCompo) => {
    return data.role == 'user' ? (
      <SentMessage timestamp={timestamp}>{msgCompo}</SentMessage>
    ) : (
      <ReceivedMessage timestamp={timestamp}>{msgCompo}</ReceivedMessage>
    );
  };

  const msgCompo = (
    <>
      {(() => {
        switch (data.type) {
          case 'text':
            return (
              <TextMessage
                data={data}
                messageId={messageId}
                enableCopy={data.role == 'assistant'}
              />
            );
          case 'option':
            return <OptionMessage data={data} messageId={messageId} />;
          case 'image':
            return <ImageMessage data={data} messageId={messageId} />;
          case 'error':
            return <ErrorMessage data={data}/>
          default:
            return null;
        }
      })()}
    </>
  );

  return messageWrapper(msgCompo);
};

export default React.memo(Message);
