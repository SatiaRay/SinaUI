import React from 'react';
import OptionMessage from './components/OptionMessage';
import ImageMessage from './components/ImageMessage';
import TextMessage from './components/TextMessage';
import SentMessage from './SentMessage';
import ReceivedMessage from './ReceivedMessage';

const Message = ({ messageId, data }) => {
  const messageWrapper = (msgCompo) => {
    return data.role == 'user' ? (
      <SentMessage timestamp={data.created_at}>{msgCompo}</SentMessage>
    ) : (
      <ReceivedMessage timestamp={data.created_at}>{msgCompo}</ReceivedMessage>
    );
  };

  const msgCompo = (
    <>
      {(() => {
        switch (data.type) {
          case 'text':
            return <TextMessage data={data} messageId={messageId} />;
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
