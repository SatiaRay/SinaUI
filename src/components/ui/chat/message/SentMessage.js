import { formatTimestamp } from '../../../../utils/helpers';
import { SentMessageContainer, SentMessageHeader, SentMessageTimestamp, SentMessageLabel } from '../../common';

const SentMessage = ({ children, created_at }) => {
  return (
    <SentMessageContainer>
      <SentMessageHeader>
        <SentMessageTimestamp>
          {formatTimestamp(created_at)}
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