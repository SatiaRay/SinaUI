import { useEffect, useState } from 'react';
import {
  ImageMessageContainer,
  ImageWrapper,
  ImagePlaceholder,
  ImageSpinner,
  ImageElement,
  ImageGrid,
  ImageOverlay,
  ImageOverlayText,
  FlexWrapper,
  FlexGapWrapper,
} from '../../../common';

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
    <ImageWrapper key={idx}>
      {!loadedImages[idx] && (
        <ImagePlaceholder>
          <ImageSpinner />
        </ImagePlaceholder>
      )}
      <ImageElement
        src={`${process.env.REACT_APP_CHAT_API_URL}${img.url}`}
        alt={img.filename}
        loaded={loadedImages[idx]}
        onLoad={() => handleLoad(idx)}
      />
    </ImageWrapper>
  );

  return (
    <ImageMessageContainer>
      {images.length === 1 && renderImageOrPlaceholder(images[0], 0)}

      {images.length === 2 && (
        <FlexWrapper>
          {images.map((img, idx) => renderImageOrPlaceholder(img, idx))}
        </FlexWrapper>
      )}

      {images.length === 3 && (
        <FlexWrapper>
          <FlexGapWrapper>
            {images
              .slice(0, 2)
              .map((img, idx) => renderImageOrPlaceholder(img, idx))}
          </FlexGapWrapper>
          {renderImageOrPlaceholder(images[2], 2)}
        </FlexWrapper>
      )}

      {images.length >= 4 && (
        <ImageGrid>
          {displayedImages.map((img, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              {renderImageOrPlaceholder(img, idx)}
              {idx === 3 && images.length > 4 && (
                <ImageOverlay>
                  <ImageOverlayText>+{images.length - 4}</ImageOverlayText>
                </ImageOverlay>
              )}
            </div>
          ))}
        </ImageGrid>
      )}
    </ImageMessageContainer>
  );
};

export default ImageMessage;
