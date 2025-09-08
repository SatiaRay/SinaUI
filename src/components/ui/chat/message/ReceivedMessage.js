import { formatTimestamp } from "../../../../utils/helpers";

const ReceivedMessage = ({ children, timestamp }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 flex flex-col text-wrap md:ml-1 md:mr-8 rounded-lg min-w-[10rem] w-full max-w-full justify-self-end">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatTimestamp(timestamp)}
        </span>
        <span className="text-xs font-medium text-green-600 dark:text-green-400">
          چت‌بات
        </span>
      </div>
      <div>
        <h3 className="font-bold mb-2 text-gray-900 dark:text-white">پاسخ:</h3>
        {children}
      </div>
    </div>
  );
};

export default ReceivedMessage;
