import React, { useRef, useEffect, useState } from "react";
import MusicPlayer from "@/components/musicPlayer";
import "@/components/musicPlayer.css";
import { getDeviceType } from "@/utils/getDeviceType";
import SideBar from "@/components/sideBar";
import MusicDrop from "@/components/musicDrop";

const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);

  const [fileName, setFileName] = useState({});
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [song, setSong] = useState([]);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    const ctx = canvas.getContext("2d");
    audio.volume = 0.5;

    const initAudioContext = () => {
      audioCtxRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioCtxRef.current.createAnalyser();

      const source = audioCtxRef.current.createMediaElementSource(audio);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioCtxRef.current.destination);
      analyserRef.current.fftSize = 128;
    };

    const visualize = () => {
      const { width, height } = canvas;
      const dataArray = new Uint8Array(28);
      const barSpacing = 8;
      const bufferLength = dataArray.length;

      const barWidth =
        (width - (bufferLength - 1) * barSpacing) / bufferLength / 1.05;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "white";

      const drawBars = () => {
        const x = (width - (barWidth + barSpacing) * bufferLength) / 2;
        const y = height / 2;

        const minBarHeight = 20;
        const maxBarHeight = height * 0.95;
        const borderRadius = 9;

        const scale = (maxBarHeight - minBarHeight) / 255;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = Math.max(minBarHeight, dataArray[i] * scale);
          const xPos = x + (barWidth + barSpacing) * i;
          const yPos = y - barHeight / 2;

          ctx.beginPath();
          ctx.moveTo(xPos + borderRadius, yPos);
          ctx.lineTo(xPos + barWidth - borderRadius, yPos);
          ctx.quadraticCurveTo(
            xPos + barWidth,
            yPos,
            xPos + barWidth,
            yPos + borderRadius
          );
          ctx.lineTo(xPos + barWidth, yPos + barHeight - borderRadius);
          ctx.quadraticCurveTo(
            xPos + barWidth,
            yPos + barHeight,
            xPos + barWidth - borderRadius,
            yPos + barHeight
          );
          ctx.lineTo(xPos + borderRadius, yPos + barHeight);
          ctx.quadraticCurveTo(
            xPos,
            yPos + barHeight,
            xPos,
            yPos + barHeight - borderRadius
          );
          ctx.lineTo(xPos, yPos + borderRadius);
          ctx.quadraticCurveTo(xPos, yPos, xPos + borderRadius, yPos);
          ctx.closePath();

          ctx.fill();
        }
      };

      const renderFrame = () => {
        if (audio.paused) {
          cancelAnimationFrame(animationFrameId.current);
          return;
        }
        ctx.clearRect(0, 0, width, height);
        analyserRef.current.getByteFrequencyData(dataArray);
        drawBars();

        animationFrameId.current = requestAnimationFrame(renderFrame);
      };

      renderFrame();
    };

    audio.addEventListener("play", () => {
      setIsPlaying(true);
      if (!audioCtxRef.current) {
        initAudioContext();
      }
      audioCtxRef.current.resume().then(() => visualize());
    });

    audio.addEventListener("pause", () => {
      setIsPlaying(false);
      cancelAnimationFrame(animationFrameId.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== "suspended") {
        audioCtxRef.current.suspend();
      }
    });

    return () => {
      audio.removeEventListener("play", visualize);
      audio.removeEventListener("pause", visualize);
      cancelAnimationFrame(animationFrameId.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend();
        audioCtxRef.current.close().then(() => {
          audioCtxRef.current = null;
          analyserRef.current = null;
          audioRef.current = null;
        });
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const handleNextSong = (index, isNext) => {
      const newIndex = isNext
        ? song.length - 1 === index
          ? 0
          : index + 1
        : index - 1 < 0
        ? song.length - 1
        : index - 1;
      handleSongChange(song[newIndex], newIndex);
    };
    if (audio) {
      audio.addEventListener("ended", () => {
        handleNextSong(fileName.index, true);
      });
    }
  }, [fileName.index, song]);

  useEffect(() => {
    const audio = audioRef.current;
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const handleFileChange = (files) => {
    console.log(files);
    if (files) {
      const url = URL.createObjectURL(files);
      const songData = {
        src: url,
        title: files.name.split(".")[0],
      };
      setSong((prev) => [...prev, songData]);

      audioRef.current.pause();
      handleSongChange(songData, song.length);
    }
  };

  const handleSongChange = (songData, index) => {
    if (audioRef.current?.isPlaying) {
      audioRef.current.pause();
    }
    if (isPlaying) {
      setIsPlaying(false);
    }

    setFileName({
      title: songData?.title,
      index: index,
    });

    setTimeout(() => {
      setIsPlaying(true);
      audioRef.current.src = songData?.src;
      getDeviceType() === "PC" && audioRef.current.play();
    }, 100);
  };

  const handleNextSong = (index, isNext) => {
    const newIndex = isNext
      ? song.length - 1 === index
        ? 0
        : index + 1
      : index - 1 < 0
      ? song.length - 1
      : index - 1;

    handleSongChange(song[newIndex], newIndex);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleTimeChange = (event) => {
    audioRef.current.currentTime = event.target.value;
  };

  const handlePlayRandomSong = (index) => {
    if (song.length === 1) return;
    const numbersArray = Array.from({ length: song.length }, (_, i) => i);
    numbersArray.splice(index, 1);
    const randomIndex = Math.floor(Math.random() * numbersArray.length);
    handleSongChange(
      song[numbersArray[randomIndex]],
      numbersArray[randomIndex]
    );
  };

  const handleClearSong = () => {
    const audio = audioRef.current;
    const audioCtx = audioCtxRef.current;
    const canvas = canvasRef.current;

    if (audio && !audio.paused) {
      audio.pause();
    }
    // if (audioCtx && audioCtx.state !== "suspended") {
    //   audioCtx.suspend();
    // }
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsPlaying(false);
    setCurrentTime(0);
    setFileName({});
    setIsPlaying(false);
  };

  const handleRemoveSong = (index) => {
    const songData = song;
    songData.splice(index, 1);

    const nextSong = songData[songData.length - 1];
    const newIndex =
      index - 1 < 0
        ? songData.length - 1
        : index - 1 === songData.length - 1
        ? songData.length - 1
        : index;
    setSong(songData);

    songData.length === 0
      ? handleClearSong()
      : handleSongChange(nextSong, newIndex);
  };

  const handleAudioVolume = () => {
    const audio = audioRef.current;
    audio.volume === 0 ? (audio.volume = 0.5) : (audio.volume = 0);
  };

  return (
    <div className="w-[100dvw] h-[100dvh] justify-start items-center flex flex-row overflow-hidden">
      <SideBar
        song={song}
        songChange={handleSongChange}
        songRemove={handleRemoveSong}
        fileChange={handleFileChange}
        fileName={fileName}
      />

      <div className="w-[75%] h-full justify-center items-center flex flex-col relative left-[25%] top-0">
        <audio className="absolute bottom-0 right-0 hidden" ref={audioRef} />

        {audioRef.current && (
          <div
            className={`flex w-full h-full ${
              !isPlaying && song.length === 0 ? "opacity-0" : "opacity-100"
            }`}
          >
            <MusicPlayer
              ref={audioRef}
              onClick={handlePlayPause}
              currentVolume={audioRef.current.volume}
              volume={handleAudioVolume}
              time={handleTimeChange}
              prev={() => {
                handleNextSong(fileName.index, false);
              }}
              next={() => {
                handleNextSong(fileName.index, true);
              }}
              isPlaying={isPlaying}
              shuffle={() => {
                handlePlayRandomSong(fileName.index);
              }}
              currentTime={currentTime}
              title={fileName.title}
            />
          </div>
        )}

        <canvas
          className={`audio-visualizer ${
            !isPlaying && song.length === 0 ? "opacity-0" : "opacity-100"
          }  absolute -bottom-10 left-[50%] -translate-x-1/2 pb-24 justify-center items-center flex transition-all duration-200}`}
          ref={canvasRef}
          width={700}
          height={300}
          style={{ width: "50%", height: "30%" }}
        />
      </div>
    </div>
  );
};

export default AudioVisualizer;
