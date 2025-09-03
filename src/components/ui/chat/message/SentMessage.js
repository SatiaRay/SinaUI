import { formatTimestamp } from "../../../../utils/helpers";

const SentMessage = ({ children, timestamp }) => {
  return (
    <div className="bg-blue-100/70 md:ml-16 dark:bg-blue-900/20 p-3 rounded-lg text-right max-w-3xl min-w-[10rem] inline-block justify-self-start">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatTimestamp(timestamp)}
        </span>
        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
          شما
        </span>
      </div>
      {children}
    </div>
  );
};

export default SentMessage;
