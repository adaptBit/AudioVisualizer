import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const ImageDrop = (props) => {
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const storedBackgroundImage = localStorage.getItem("backgroundImage");
    if (storedBackgroundImage) {
      setBackgroundImage(storedBackgroundImage);
    }
  }, []);

  const onDrop = (acceptedFiles) => {
    const reader = new FileReader();
    if (acceptedFiles[0].type === "audio/mpeg") {
      return;
    }
    reader.onload = () => {
      const imageDataURL = reader.result;
      setBackgroundImage(imageDataURL);
      localStorage.setItem("backgroundImage", imageDataURL);
    };
    reader.readAsDataURL(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noKeyboard: true,
    noClick: true,
    accept: "image/*",
    multiple: false,
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg", ".jpeg", ".webp", ".avif"],
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
    <div
      className="h-[100dvh] w-[100dvw] bg-cover flex items-center justify-center bg-center"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : `url('/defaultBackground.jpg')`,
      }}
    >
      <div
        {...getRootProps()}
        className={`dropzone h-[100dvh] w-[100dvw] rounded flex items-center justify-center cursor-default`}
      >
        <input {...getInputProps()} onKeyDown={(e) => e.stopPropagation()} />
        {props.children}
      </div>
    </div>
  );
};

export default ImageDrop;
