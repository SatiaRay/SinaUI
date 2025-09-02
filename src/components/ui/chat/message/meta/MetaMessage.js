import UploadImage from "./UploadImage";
import { useChat } from "../../../../../contexts/ChatContext";
import React, { useEffect, useState, useCallback } from "react";
import { fileEndpoints } from "../../../../../utils/apis";

const MetaMessage = ({ messageId, metadata }) => {
  const { sendData, removeMessage,  sendUploadedImage} = useChat();
  const [isLoading, setIsLoading] = useState(false);

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
                return (
                  <UploadImage
                    onCacnel={cancel}
                    onUpload={upload}
                    isLoading={isLoading}
                  />
                );
            }
          })();
        }
        default:
          return null;
      }
    },
    [metadata, isLoading]
  );

  /**
   * Cacnel send meta message
   */
  const cancel = () => {
    if (!window.confirm("آیا مطمئن هستید ؟")) return;

    sendData({
      event: "cancel",
      desc: `Client canceled sending ${metadata.option} message`,
    });

    removeMessage(messageId);
  };

  /**
   * Upload file to chat websocket channel
   */
  const upload = async (files) => {
    if (!window.confirm("آیا مطمئن هستید ؟")) return;

    setIsLoading(true);

    const data = await fileEndpoints.uploadFiles(files)

    setIsLoading(false)

    sendUploadedImage(data['files'])

    removeMessage(messageId)
  };

  return <>{getMessageComponent(metadata)}</>;
};

export default MetaMessage;
