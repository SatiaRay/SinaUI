import { useEffect, useState } from 'react';

const ImageMessage = ({ data }) => {
  const [images, setImages] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    const imgs = JSON.parse(data.body);
    setImages(imgs);
  }, [data.body]);

  const handleLoad = (idx) => {
    setLoadedImages((prev) => ({ ...prev, [idx]: true }));
  };

  const displayedImages = images.length > 4 ? images.slice(0, 4) : images;

  const renderImageOrPlaceholder = (img, idx) => (
    <div
      key={idx}
      className="relative rounded-lg overflow-hidden w-[181px] h-[181px] md:w-[211px] md:h-[211px]"
    >
      {!loadedImages[idx] && (
        <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-white dark:border-gray-800 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={`${process.env.REACT_APP_CHAT_API_URL}${img.url}`}
        alt={img.filename}
        className={`w-full h-full object-cover ${loadedImages[idx] ? 'block' : 'hidden'}`}
        onLoad={() => handleLoad(idx)}
      />
    </div>
  );

  return (
    <div className="py-2 px-3 rounded-lg text-right bg-gray-100 dark:bg-gray-800 flex flex-wrap gap-1 max-w-full md:max-w-[450px]">
      {images.length === 1 && renderImageOrPlaceholder(images[0], 0)}

      {images.length === 2 && (
        <div className="flex flex-wrap gap-1">
          {images.map((img, idx) => renderImageOrPlaceholder(img, idx))}
        </div>
      )}

      {images.length === 3 && (
        <div className="flex flex-wrap gap-1">
          <div className="flex gap-1">
            {images
              .slice(0, 2)
              .map((img, idx) => renderImageOrPlaceholder(img, idx))}
          </div>
          {renderImageOrPlaceholder(images[2], 2)}
        </div>
      )}

      {images.length >= 4 && (
        <div className="grid grid-cols-2 gap-1">
          {displayedImages.map((img, idx) => (
            <div key={idx} className="relative">
              {renderImageOrPlaceholder(img, idx)}
              {idx === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                  <span className="text-white text-xl font-bold">
                    +{images.length - 4}
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
