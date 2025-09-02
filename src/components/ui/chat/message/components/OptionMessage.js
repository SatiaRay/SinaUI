import MetaMessage from "./meta/MetaMessage";
import { formatTimestamp } from "../../../../../utils/helpers";

const OptionMessage = ({ data, messageId }) => {
  return (
    <div>
      <MetaMessage messageId={messageId} metadata={data.metadata} />
    </div>
  );
};

export default OptionMessage;
