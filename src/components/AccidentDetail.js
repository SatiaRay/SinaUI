import React, { useState } from 'react';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ImagePreview from './ImagePreview';

const AccidentDetail = ({ accident, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  if (!accident) return null;

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleClosePreview = () => {
    setSelectedImageIndex(null);
  };

  const handlePreviousImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    } else {
      setSelectedImageIndex(accident.images.length - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex < accident.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    } else {
      setSelectedImageIndex(0);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const persianDate = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
    return persianDate;
  };

  return (
    <>
      <div className="dialog">
        <div className="dialog-overlay" onClick={onClose} />
        <div className="dialog-content">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">جزئیات حادثه</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">شماره حادثه</label>
                <div className="input bg-gray-50">{accident.id}</div>
              </div>

              <div className="form-group">
                <label className="form-label">وسیله نقلیه</label>
                <div className="input bg-gray-50">
                  {accident.vehicle?.plate_number} - {accident.vehicle?.model} ({accident.vehicle?.color}) - {accident.vehicle?.station?.name}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">راننده</label>
                <div className="input bg-gray-50">
                  {accident.driver?.name || `${accident.driver?.first_name || ''} ${accident.driver?.last_name || ''}`}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">نوع حادثه</label>
                <div className="input bg-gray-50">{accident.accident_type?.name}</div>
              </div>

              <div className="form-group">
                <label className="form-label">تاریخ و زمان</label>
                <div className="input bg-gray-50">
                  {formatDate(accident.accident_datetime)}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">مکان</label>
                <div className="input bg-gray-50">{accident.location}</div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">توضیحات</label>
              <div className="input bg-gray-50 min-h-[100px] whitespace-pre-wrap">
                {accident.description || 'توضیحاتی ثبت نشده است'}
              </div>
            </div>

            {accident.images && accident.images.length > 0 && (
              <div className="form-group">
                <label className="form-label">تصاویر</label>
                <div className="grid grid-cols-4 gap-4">
                  {accident.images.map((image, index) => (
                    <div 
                      key={index} 
                      className="relative cursor-pointer"
                      onClick={() => handleImageClick(index)}
                    >
                      <img
                        src={`http://localhost:8000/storage/${image.image_path}`}
                        alt={`تصویر ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg hover:opacity-75 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              بستن
            </button>
          </div>
        </div>
      </div>

      {selectedImageIndex !== null && (
        <ImagePreview
          images={accident.images}
          currentIndex={selectedImageIndex}
          onClose={handleClosePreview}
          onPrevious={handlePreviousImage}
          onNext={handleNextImage}
        />
      )}
    </>
  );
};

export default AccidentDetail; 