import { formatTimestamp } from '../../../../utils/helpers';
import { SentMessageContainer, SentMessageHeader, SentMessageTimestamp, SentMessageLabel } from '../../common';

const SentMessage = ({ children, timestamp }) => {
  return (
    <SentMessageContainer>
      <SentMessageHeader>
        <SentMessageTimestamp>
          {formatTimestamp(timestamp)}
        </SentMessageTimestamp>
        <SentMessageLabel>
          شما
        </SentMessageLabel>
      </SentMessageHeader>
      {children}
    </SentMessageContainer>
  );
};

export default SentMessage;