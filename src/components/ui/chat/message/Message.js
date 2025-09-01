import { copyToClipboard } from "../../../../utils/helpers";
import React, { useState } from "react";
import { notify } from "../../../../ui/toast";
import AnswerMessage from "./AnswerMessage";
import QuestionMessage from "./QuestionMessage";
import OptionMessage from "./OptionMessage";
import ImageMessage from "./ImageMessage";

const Message = ({ messageId, data }) => {
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  /**
   * Copy answer message text to device clipboard
   *
   * @param {string} textToCopy
   * @param {int} messageId
   */
  const handleCopyAnswer = (textToCopy, messageId) => {
    const temp = document.createElement("div");
    temp.innerHTML = textToCopy;
    const plainText = temp.textContent || temp.innerText || "";

    copyToClipboard(plainText)
      .then(() => {
        setCopiedMessageId(messageId);
        notify.success("متن کپی شد!", {
          autoClose: 1000,
          position: "top-left",
        });

        setTimeout(() => setCopiedMessageId(null), 4000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  return (
    <>
      {(() => {
        switch (data.type) {
          case "question":
            return <QuestionMessage data={data} messageId={messageId} />;
          case "answer":
            return <AnswerMessage data={data} messageId={messageId} />;
          case "option":
            return <OptionMessage data={data} messageId={messageId} />;
          case "image":
            return <ImageMessage data={data} messageId={messageId} />;
          default:
            return null;
        }
      })()}
    </>
  );
};

export default React.memo(Message);
