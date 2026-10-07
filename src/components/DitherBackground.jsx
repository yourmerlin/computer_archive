import { useEffect, useRef } from "react";
import { startDither } from "../ditherBG.js";

export default function DitherBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const stop = startDither(canvasRef.current);
    return stop;
  }, []);

  return <canvas id="ditherCanvas" ref={canvasRef} />;
}
