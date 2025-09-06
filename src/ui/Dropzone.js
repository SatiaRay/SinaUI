import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { RiUploadCloud2Fill } from 'react-icons/ri';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%',
};

const Dropzone = ({ onChange }) => {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (acceptedFiles) => {
      addFile(acceptedFiles[0]);
    },
  });

  useEffect(() => {
    onChange(files);
  }, [files]);

  const addFile = (file) => {
    Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    setFiles((prev) => [...prev, file]);
  };

  const thumbs = files.map((file, index) => (
    <div style={thumb} key={index}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="container">
      <div
        {...getRootProps({ className: 'dropzone' })}
        className="text-center cursor-pointer grid justify-center align-center border-2 border-dashed border-gray-500 py-3"
      >
        <input {...getInputProps()} />
        <RiUploadCloud2Fill
          size={150}
          className="justify-self-center"
          color="white"
        />
        <p className="pt-5 dark:text-white">
          فایل مورد نظر را بکشید و در اینجا رها کنید یا بر روی آیکون کلیک کنید
        </p>
      </div>
      <aside style={thumbsContainer}>{thumbs}</aside>
    </section>
  );
};

export default Dropzone;
