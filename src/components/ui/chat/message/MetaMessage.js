import { useCallback } from "react";
import UploadImage from "./meta/UploadImage";
import { useChat } from "../../../../contexts/ChatContext";

const MetaMessage = ({ messageId, metadata }) => {
  const {sendData, removeMessage} = useChat()

  /**
   * Get memoized message component
   */
  const getMessageComponent = useCallback(
    (metadata) => {
      switch (metadata.option) {
        case "upload": {
          return (() => {
            switch (metadata.upload_type) {
              case "image":
                return <UploadImage />;
            }
          })();
        }
        default:
          return null;
      }
    },
    [metadata]
  );

  /**
   * Cacnel send meta message
   */
  const cancel = () => {
    sendData({
      event: 'cancel',
      desc: `Client canceled sending ${metadata.option} message`
    })

    removeMessage(messageId)
  }

  return (
    <>
      {getMessageComponent(metadata)}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          ارسال
        </button>
        <button
          type="button"
          className="px-3 py-2 text-xs font-medium text-center text-white bg-yellow-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-yellow-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={cancel}
        >
          انصراف
        </button>
      </div>
    </>
  );
};

export default MetaMessage;
