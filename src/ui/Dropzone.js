import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { RiUploadCloud2Fill } from 'react-icons/ri';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
  marginTop: 12,
};

const thumb = {
  position: 'relative',
  display: 'inline-flex',
  borderRadius: 6,
  border: '1px solid #eaeaea',
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
  overflow: 'hidden',
  background: '#fff',
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
};

const imgStyle = {
  display: 'block',
  width: 'auto',
  height: '100%',
};

const removeBtnStyle = {
  position: 'absolute',
  top: 4,
  right: 4,
  background: 'rgba(0,0,0,0.6)',
  color: 'white',
  borderRadius: 4,
  width: 20,
  height: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: 12,
};

const Dropzone = ({
  files: controlledFiles,
  onChange,
  maxFiles = 5,
  maxTotalSize = 10 * 1024 * 1024, // مجموع حجم فایل‌ها
  accept = {
    'image/jpeg': [],
    'image/png': [],
    'image/webp': [],
    'image/jpg': [],
  },
}) => {
  const [filesState, setFilesState] = useState(controlledFiles ?? []);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (controlledFiles !== undefined) {
      setFilesState(controlledFiles.map((f) => ensurePreview(f)));
    }
  }, [controlledFiles]);

  const ensurePreview = (file) => {
    if (!file) return file;
    if (file.preview) return file;
    try {
      const copy = Object.assign(file, { preview: URL.createObjectURL(file) });
      return copy;
    } catch {
      return file;
    }
  };

  const revokePreviews = (filesArr) => {
    filesArr.forEach((f) => {
      if (f && f.preview) {
        try {
          URL.revokeObjectURL(f.preview);
        } catch {}
      }
    });
  };

  useEffect(() => {
    return () => {
      revokePreviews(filesState);
    };
  }, []);

  const emitChange = (nextFiles) => {
    if (onChange) onChange(nextFiles);
  };

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      setError(null);

      const remainingSlots = Math.max(0, maxFiles - filesState.length);
      const willAdd = acceptedFiles.slice(0, remainingSlots);
      const overflow = acceptedFiles.slice(remainingSlots);

      const errors = [];

      if (overflow.length > 0) {
        errors.push(
          `حداکثر ${maxFiles} فایل مجاز است. ${overflow.length} فایل اضافه نشد.`
        );
      }

      // بررسی خطاهای Dropzone (غیر از حجم)
      fileRejections.forEach((rej) => {
        rej.errors.forEach((e) => {
          if (e.code === 'file-invalid-type') {
            errors.push(`${rej.file.name} — فرمت پشتیبانی نمی‌شود.`);
          } else {
            errors.push(`${rej.file.name} — ${e.message || e.code}`);
          }
        });
      });

      const actuallyAddable = [];
      willAdd.forEach((f) => {
        if (
          !['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(
            f.type
          )
        ) {
          errors.push(`${f.name} — فرمت پشتیبانی نمی‌شود`);
        } else {
          actuallyAddable.push(ensurePreview(f));
        }
      });

      if (actuallyAddable.length > 0) {
        setFilesState((prev) => {
          const next = [...prev, ...actuallyAddable].slice(0, maxFiles);

          // بررسی مجموع حجم
          const totalSize = next.reduce((sum, f) => sum + f.size, 0);
          if (totalSize > maxTotalSize) {
            setError(
              `مجموع حجم فایل‌ها (${Math.round(
                totalSize / (1024 * 1024)
              )}MB) بیشتر از ${Math.round(
                maxTotalSize / (1024 * 1024)
              )}MB است. فایل‌(های) جدید اضافه نشدند.`
            );
            return prev; // فایل‌های جدید اضافه نمی‌شوند
          }

          emitChange(next);
          return next;
        });
      }

      if (errors.length > 0) {
        setError(errors.join(' ، '));
      }
    },
    [filesState, maxFiles, maxTotalSize, onChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept,
    multiple: true,
    onDrop,
  });

  const removeFileAt = (index) => {
    setFilesState((prev) => {
      const toRemove = prev[index];
      if (toRemove && toRemove.preview) {
        try {
          URL.revokeObjectURL(toRemove.preview);
        } catch {}
      }
      const next = prev.filter((_, i) => i !== index);
      emitChange(next);
      return next;
    });
    setError(null);
  };

  const clearAll = () => {
    revokePreviews(filesState);
    setFilesState([]);
    emitChange([]);
    setError(null);
  };

  const thumbs = filesState.map((file, index) => (
    <div style={thumb} key={file.name + index}>
      <div style={thumbInner}>
        <img src={file.preview} alt={file.name} style={imgStyle} />
      </div>
      <div
        role="button"
        aria-label={`حذف ${file.name}`}
        title="حذف"
        style={removeBtnStyle}
        onClick={() => removeFileAt(index)}
      >
        ×
      </div>
    </div>
  ));

  return (
    <section className="w-full">
      <div
        {...getRootProps({ className: 'dropzone' })}
        className="text-center cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-500 py-3 relative"
      >
        <input
          {...getInputProps()}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <RiUploadCloud2Fill
          size={150}
          className="justify-self-center text-gray-700  dark:text-white"
        />
        <p className="pt-3 text-sm text-gray-700 dark:text-gray-200">
          فایل‌ها را بکشید یا کلیک کنید (حداکثر {maxFiles} فایل — مجموع ≤{' '}
          {Math.round(maxTotalSize / (1024 * 1024))}MB)
        </p>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 text-gray-700 dark:text-white text-sm">
        <div>
          انتخاب‌شده: {filesState.length} / {maxFiles}
        </div>
        {filesState.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs px-2 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            پاک کردن همه
          </button>
        )}
      </div>

      <aside style={thumbsContainer} className="mt-2">
        {thumbs}
      </aside>
    </section>
  );
};

export default Dropzone;
