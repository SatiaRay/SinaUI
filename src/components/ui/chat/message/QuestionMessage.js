import { formatTimestamp } from "../../../../utils/helpers";

const QuestionMessage = ({data, messageId}) => {
  return (
    <div className="bg-blue-100/70 md:ml-16 dark:bg-blue-900/20 p-3 rounded-lg text-right">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatTimestamp(data.timestamp)}
        </span>
        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
          شما
        </span>
      </div>
      <pre
        className="text-gray-800 pt-1 leading-5 dark:text-white [&_a]:text-blue-600 [&_a]:hover:text-blue-700 [&_a]:underline [&_a]:break-all dark:[&_a]:text-blue-400 dark:[&_a]:hover:text-blue-300"
        dangerouslySetInnerHTML={{ __html: data.text }}
      />
    </div>
  );
};

export default QuestionMessage;