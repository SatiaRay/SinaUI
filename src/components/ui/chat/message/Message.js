import { copyToClipboard } from "../../../../utils/helpers";
import React, { useState } from "react";
import { notify } from "../../../../ui/toast";
import AnswerMessage from "./AnswerMessage";
import QuestionMessage from "./QuestionMessage";
import OptionMessage from "./OptionMessage";
import ImageMessage from "./ImageMessage";

const Message = ({ messageId, data }) => {
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
