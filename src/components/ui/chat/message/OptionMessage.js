import MetaMessage from "./meta/MetaMessage";
import { formatTimestamp } from "../../../../utils/helpers";

const OptionMessage = ({data, messageId}) => {
  return (
    <div className=" bg-white dark:bg-gray-800 px-4 py-2 flex flex-col text-wrap md:ml-1 md:mr-8 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatTimestamp(data.timestamp)}
        </span>
        <span className="text-xs font-medium text-green-600 dark:text-green-400">
          چت‌بات
        </span>
      </div>
      <div>
        <h3 className="font-bold mb-2 text-gray-900 dark:text-white">پاسخ:</h3>
        <div>
          <MetaMessage messageId={messageId} metadata={data.metadata} />
        </div>
      </div>
    </div>
  );
};

export default OptionMessage