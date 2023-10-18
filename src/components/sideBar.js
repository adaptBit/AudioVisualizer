import MusicDrop from "@/components/musicDrop";
import SvgClose from "./svgComponent/svgClose";

const SideBar = (props) => {
  const song = props.song;
  return (
    <div className="bg-slate-600 absolute top-0 left-0 flex flex-col justify-start items-center w-[25%]  h-[100dvh] opacity-80 overflow-y-auto  ">
      <div className="w-full h-full absolute left-0">
        <MusicDrop onDrop={props.fileChange} />
      </div>

      <div className="h-full w-full mt-[20%]">
        {song.map((data, index) => {
          return (
            <div key={index} className="flex flex-row justify-center ">
              <div
                className={`bg-slate-700 w-10/12 hover:bg-slate-800 ${
                  props.fileName.index === index ? "bg-slate-900" : null
                } rounded-lg m-2 flex flex-row justify-start line-clamp-1 cursor-pointer transition-all duration-200 z-50`}
                onClick={() => {
                  props.songChange(data, index);
                }}
              >
                <p className={`m-4 text-white `}>{data.title}</p>
              </div>
              <div
                className="h-auto my-auto rounded-3xl m-2 justify-start cursor-pointer transition-all duration-200 z-50 bg-slate-800 hover:bg-slate-900 p-2"
                onClick={() => {
                  props.songRemove(index);
                }}
              >
                <SvgClose
                  className="svg-secondary"
                  height="1.5rem"
                  width="1.5rem"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;
