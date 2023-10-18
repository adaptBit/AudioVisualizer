import AudioVisualizer from "@/components/audioVisualizer";
import ImageDrop from "@/components/imageDrop";
import "@/app/globals.css";

export default function Home() {
  return (
    <div className="flex h-[100dvh] w-[100dvw] justify-center items-center overflow-hidden">
      <ImageDrop>
        <AudioVisualizer />
      </ImageDrop>
    </div>
  );
}
