import { formatTimestamp } from '../../../../utils/helpers';

const ReceivedMessage = ({ children, timestamp }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 leading-8 px-2 py-2 flex flex-col text-wrap md:ml-1 md:mr-8 rounded-lg min-w-[10rem] w-full max-w-full justify-self-end">
      <div>{children}</div>
    </div>
  );
};

export default ReceivedMessage;
