import React from "react";
import { useDropzone } from "react-dropzone";

const MusicDrop = (props) => {
  const onDrop = (acceptedFiles) => {
    const reader = new FileReader();
    reader.readAsDataURL(acceptedFiles[0]);
    props.onDrop(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noKeyboard: true,
    accept: "audio/*",
    multiple: true,
    accept: {
      "audio/mp3": [
        ".mp3",
        ".m4a",
        ".wav",
        ".ogg",
        ".flac",
        ".aac",
        ".webm",
        ".mpeg",
      ],
    },
  });

  return (
    <div className="bg-cover flex items-center w-[100%] h-[100%] justify-center bg-center cursor-pointer">
      <div
        {...getRootProps()}
        className={`dropzone h-[100%] w-[100%] text-lg font-bold p-8 items-center justify-center text-center text-white rounded-lg opacity-80 hover:opacity-100${
          isDragActive ? "bg-slate-100 bg-opacity-30" : ""
        }`}
      >
        Click to browse or drop music
        <input {...getInputProps()} onKeyDown={(e) => e.stopPropagation()} />
        {props.children}
      </div>
    </div>
  );
};

export default MusicDrop;
