import React from 'react';
import OptionMessage from './components/OptionMessage';
import ImageMessage from './components/ImageMessage';
import TextMessage from './components/TextMessage';
import SentMessage from './SentMessage';
import ReceivedMessage from './ReceivedMessage';

const Message = ({ messageId, data }) => {
  let timestamp = data.created_at;
  if (!timestamp && data.timestamp) {
    timestamp = data.timestamp;
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
                enableCopy={data.role === 'assistant'}
              />
            );
          case 'option':
            return <OptionMessage data={data} messageId={messageId} />;
          case 'image':
            return <ImageMessage data={data} messageId={messageId} />;
          default:
            return null;
        }
      })()}
    </>
  );

  return messageWrapper(msgCompo);
};

export default React.memo(Message);
