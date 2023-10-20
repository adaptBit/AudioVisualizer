import React, { forwardRef, useEffect, useState } from "react";
import "@/components/musicPlayer.css";
import SvgPlay from "./svgComponent/svgPlay";
import SvgPause from "./svgComponent/svgPause";
import SvgVolume from "./svgComponent/svgVolume";
import SvgVolumeLoud from "./svgComponent/svgVolumeLoud";
import SvgShuffle from "./svgComponent/svgShuffle";
import SvgRewindBack from "./svgComponent/svgRewindBack";
import SvgRewindForward from "./svgComponent/svgRewindForward";

const MusicPlayer = forwardRef(function MusicPlayer(props, ref) {
  const [title, setTitle] = useState("");
  const [show, setShow] = useState(true);

  useEffect(() => {
    const newTitle = () => {
      setTimeout(() => {
        if (title !== props.title) {
          setShow(false);
          setTimeout(() => {
            setTitle(props.title);
            setShow(true);
          }, 300);
        }
      }, 200);
    };
    newTitle();
  }, [props.title, title]);

  const toMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = Math.floor(seconds % 60);

    const minutesString = String(minutes).padStart(2, "0");
    const secondsString = String(secondsRemaining).padStart(2, "0");

    return `${minutesString}:${secondsString}`;
  };

  return (
    <div className="flex w-full h-full justify-center items-center">
      <div
        className=" music-container mb-[10%] w-[22rem] h-[24rem] lg:w-[35%] lg:h-[55%] transition-all duration-500 group bg-slate-300 rounded-lg px-4 m-2 relative flex overflow-hidden bg-cover z-50"
        style={{
          backgroundImage:
            "url(https://img.freepik.com/free-vector/gradient-lo-fi-illustrations_23-2149354630.jpg?w=740&t=st=1696931528~exp=1696932128~hmac=71d386ff267649ce6ee59b74be8327abea3091b7ee83221a98508c7444c8e738)",
        }}
      >
        <div className="z-50 bg-slate-100 w-full h-[35%] absolute left-0 bottom-0  transition-all duration-500 flex justify-start items-center flex-col">

          {/* seeking time */}
          <div className="flex flex-row w-full justify-center mt-4">
            <span className="px-4 text-[#3d49b3e0] opacity-80">
              {toMinutes(props.currentTime)}
            </span>
            <input
              className=" h-3 rounded-lg text-black appearance-none self-center "
              type="range"
              min="0"
              max={ref.current.duration ? ref.current.duration : 0}
              onChange={props.time}
              value={props.currentTime}
            />
            <span className="px-4 text-[#3d49b3e0] opacity-80 ">
              {ref.current.duration ? toMinutes(ref.current.duration) : "00:00"}
            </span>
          </div>

          {/* song title */}
          <p
            className={`text-lg mx-[15%] line-clamp-1 select-none text-[#3d49b3e0] opacity-95 transform ${
              show ? "scale-100" : "scale-0"
            } duration-300 font-bold mt-3 break-all`}
          >
            {title}
          </p>

          {/* music controller */}
          <div className="flex w-[70%] flex-row justify-between mx-auto mt-4">
            {props.currentVolume ? (
              <SvgVolumeLoud
                className="svg-secondary"
                height="1.5rem"
                width="1.5rem"
                onClick={props.volume}
              />
            ) : (
              <SvgVolume
                className="svg-secondary"
                height="1.5rem"
                width="1.5rem"
                onClick={props.volume}
              />
            )}
            <SvgRewindBack
              className="svg-secondary"
              height="1.5rem"
              width="1.5rem"
              onClick={props.prev}
            />
            {props.isPlaying ? (
              <SvgPause
                className="svg-primary"
                height="1.5rem"
                width="1.5rem"
                onClick={props.onClick}
              />
            ) : (
              <SvgPlay
                className="svg-primary"
                height="1.5rem"
                width="1.5rem"
                onClick={props.onClick}
              />
            )}
            <SvgRewindForward
              className="svg-secondary"
              height="1.5rem"
              width="1.5rem"
              onClick={props.next}
            />
            <SvgShuffle
              className="svg-secondary"
              height="1.5rem"
              width="1.5rem"
              onClick={props.shuffle}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default MusicPlayer;
