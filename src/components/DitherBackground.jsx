import { useEffect, useRef } from "react";
import { startDither } from "../ditherBG.js";

// the animated dither background from ditheringBG.js, as a component.
export default function DitherBackground() {
  // a ref gives us the real <canvas> element once react has drawn it
  const canvasRef = useRef(null);

  // useEffect runs code after the component appears on the page.
  // the function it returns runs when the component goes away (cleanup).
  useEffect(() => {
    const stop = startDither(canvasRef.current);
    return stop;
  }, []);

  return <canvas id="ditherCanvas" ref={canvasRef} />;
}
