import { formatTimestamp } from '../../../../utils/helpers';
import { ReceivedMessageContainer } from '../../common';

const ReceivedMessage = ({ children, timestamp }) => {
  return (
    <ReceivedMessageContainer>
      <div>{children}</div>
    </ReceivedMessageContainer>
  );
};

export default ReceivedMessage;
