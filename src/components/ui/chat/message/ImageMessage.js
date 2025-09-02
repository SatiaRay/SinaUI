import { formatTimestamp } from "../../../../utils/helpers";

const ImageMessage = ({ data }) => {
  const images = data.images || [];
  const imageCount = images.length;

  // Show max 4 (like Telegram grid preview)
  const displayedImages = imageCount > 4 ? images.slice(0, 4) : images;

  return (
    <div className="bg-blue-100/70 md:ml-16 dark:bg-blue-900/20 p-3 rounded-lg text-right max-w-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatTimestamp(data.timestamp)}
        </span>
        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
          شما
        </span>
      </div>

      {/* Images */}
      {imageCount === 1 && (
        <div className="rounded-lg overflow-hidden">
          <img
            src={`${process.env.REACT_APP_CHAT_API_URL}${images[0].url}`}
            alt={images[0].filename}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {imageCount === 2 && (
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={`${process.env.REACT_APP_CHAT_API_URL}${img.url}`}
              alt={img.filename}
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      )}

      {imageCount === 3 && (
        <div className="grid gap-1 rounded-lg overflow-hidden">
          {/* Top row - 2 images */}
          <div className="grid grid-cols-2 gap-1">
            {images.slice(0, 2).map((img, idx) => (
              <img
                key={idx}
                src={`${process.env.REACT_APP_CHAT_API_URL}${img.url}`}
                alt={img.filename}
                className="w-full h-full object-cover"
              />
            ))}
          </div>
          {/* Bottom row - 1 image full width */}
          <div>
            <img
              src={`${process.env.REACT_APP_CHAT_API_URL}${images[2].url}`}
              alt={images[2].filename}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {imageCount >= 4 && (
        <div className="grid grid-cols-2 grid-rows-2 gap-1 rounded-lg overflow-hidden">
          {displayedImages.map((img, idx) => (
            <div key={idx} className="relative">
              <img
                src={`${process.env.REACT_APP_CHAT_API_URL}${img.url}`}
                alt={img.filename}
                className="w-full h-full object-cover"
              />
              {/* Overlay for more images */}
              {idx === 3 && imageCount > 4 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    +{imageCount - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageMessage;
