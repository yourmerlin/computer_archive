import { useEffect, useRef } from "react";

// settings: change these to tweak the look
const PIXEL = 10; // size of each square, in px
const LIFE = 700; // how long a square lasts before it's gone, in ms
const COLOR = "#4AF626";
const MAX_PIXELS = 100; // safety cap so the list can never grow huge

// a see-through canvas over the page. moving the mouse leaves a trail of
// squares that fade out. each square is deleted from memory once it has faded.
export default function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // skip the effect for people who've asked their computer for less motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let pixels = []; // each one is { x, y, born }
    let last = null; // where the mouse was last time
    let frameId = null; // the running animation, or null when stopped

    // match the canvas to the screen. devicePixelRatio keeps squares sharp
    // on high-resolution screens.
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // add a square at the grid spot under (x, y), unless one is already there
    function addPixel(x, y, now) {
      const gx = Math.floor(x / PIXEL) * PIXEL;
      const gy = Math.floor(y / PIXEL) * PIXEL;
      const prev = pixels[pixels.length - 1];
      if (prev && prev.x === gx && prev.y === gy) return;
      pixels.push({ x: gx, y: gy, born: now });
      if (pixels.length > MAX_PIXELS) pixels.shift(); // drop the oldest
    }

    function onMove(e) {
      const now = performance.now();
      // a fast mouse jumps many px between events. fill in the squares in
      // between so the trail is a solid line instead of scattered dots.
      if (last) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        const steps = Math.ceil(Math.hypot(dx, dy) / PIXEL);
        for (let i = 1; i < steps; i++) {
          addPixel(last.x + (dx * i) / steps, last.y + (dy * i) / steps, now);
        }
      }
      addPixel(e.clientX, e.clientY, now);
      last = { x: e.clientX, y: e.clientY };

      // start drawing if we weren't already
      if (frameId === null) frameId = requestAnimationFrame(draw);
    }

    function draw() {
      const now = performance.now();

      // delete squares that have fully faded, so they don't pile up
      pixels = pixels.filter((p) => now - p.born < LIFE);

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = COLOR;
      for (const p of pixels) {
        const fade = 1 - (now - p.born) / LIFE; // 1 = new, 0 = gone
        // round the fade to 4 steps for a choppier, more "pixel" look
        ctx.globalAlpha = Math.ceil(fade * 4) / 4;
        ctx.fillRect(p.x, p.y, PIXEL, PIXEL);
      }
      ctx.globalAlpha = 1;

      // keep animating only while there's something to show.
      // when the trail is empty, stop completely (no work while idle).
      frameId = pixels.length > 0 ? requestAnimationFrame(draw) : null;
    }

    function onLeave() {
      last = null; // don't draw a line from where the mouse left to where it comes back
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);

    // cleanup when the component goes away
    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas className="cursor-trail" ref={canvasRef} />;
}
