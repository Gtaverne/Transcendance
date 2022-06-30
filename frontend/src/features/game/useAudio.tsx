// @ts-ignore
import { Howl } from "howler";
import { useEffect, useRef, useState } from 'react';


export default function useAudio(soundPath: string) {
  const audioRef = useRef<Howl | undefined>();
  const [clicked, setClicked] = useState(false);

  // @ts-ignore
  useEffect(() => {
    window.addEventListener("click", () => {
      setClicked(true);
    });
    if (!clicked)
      return;
    let audio = new Howl({ src: soundPath, volume: 0.5 });
    audioRef.current = audio;

    return () => audio.unload();
  }, [ clicked, soundPath ]);

  return () => audioRef.current?.play();
}