import MetaMessage from './meta/MetaMessage';

const OptionMessage = ({ data, messageId }) => {
  return (
    <div>
      <MetaMessage messageId={messageId} metadata={data.metadata} />
    </div>
  );
};

export default OptionMessage;
