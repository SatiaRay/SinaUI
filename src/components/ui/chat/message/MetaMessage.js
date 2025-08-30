import UploadImage from "./meta/UploadImage";

const MetaMessage = ({ metadata }) => {
  return (
    <>
      {(() => {
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
      })()}
    </>
  );
};

export default MetaMessage;
