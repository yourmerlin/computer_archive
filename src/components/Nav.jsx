import { useEffect, useRef, useState } from "react";

// the ascii art, kept in a variable so the spacing stays exactly as typed
const asciiArt = `
   _______________                         ______________
  |    ____       |     .-.     .-.      |  ___________  |
  |   |   | _     |    .    . .    .     | |           | |
  | __| 0   0 -__ |    .     .     .     | |   0   0   | |
  | |     -     | |     .happiness.      | |     -     | |
  | |   \\___/   | |      .loading.       | |   \\___/   | |
  | (___    ___ ) |       .    .         | |___________| |
  |___  |   | ____|        .  .          |_______________|
    _|__|   |_|_.............+.............._|________|_
   /            \\                          /            \\
  /    [human]   \\                        /  [computer]  \\
--------------------                    --------------------
`;
// note: in JS strings a backslash is special, so each "\" in the art is written "\\"

const title = "computers.json";

// random characters shown before each spot "decodes" into the real one
const GLYPHS = "!<>-_\\/[]{}=+*^?#01";
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

// timing (milliseconds)
const STAGGER = 12; // delay between each column starting to reveal
const SCRAMBLE = 350; // how long each character scrambles before settling
const TYPE_SPEED = 60; // delay between each letter of the title

// work out, for every character in the art, when it should settle.
// it sweeps diagonally: left-to-right, with lower rows a little later.
const lines = asciiArt.split("\n");
const settleTimes = lines.map((line, row) =>
  [...line].map((_, col) => (col + row * 3) * STAGGER + SCRAMBLE)
);
const ART_DONE = Math.max(...settleTimes.flat());

// build the art as it looks at time t
function frameAt(t) {
  return lines
    .map((line, row) =>
      [...line]
        .map((ch, col) => {
          if (ch === " ") return " "; // keep spaces so the shape holds
          const settle = settleTimes[row][col];
          if (t >= settle) return ch; // done: show the real character
          if (t >= settle - SCRAMBLE) return randomGlyph(); // scrambling
          return " "; // not started yet
        })
        .join("")
    )
    .join("\n");
}

// onIntroDone: tells App the animation finished
// loading: true while the models are still loading after the intro
// progress: 0–100, how much has loaded
export default function Nav({ onIntroDone, loading, progress }) {
  // people who turn on "reduce motion" in their system settings skip the animation
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [art, setArt] = useState(reduceMotion ? asciiArt : frameAt(0));
  const [typed, setTyped] = useState(reduceMotion ? title.length : 0);

  // keep the latest onIntroDone in a ref so the animation effect doesn't restart
  const onDoneRef = useRef(onIntroDone);
  onDoneRef.current = onIntroDone;

  useEffect(() => {
    if (reduceMotion) {
      onDoneRef.current?.();
      return;
    }

    let frame;
    const start = performance.now();

    // runs about 60 times a second until everything is done
    const tick = (now) => {
      const t = now - start;
      setArt(t >= ART_DONE ? asciiArt : frameAt(t));
      // the title starts typing once the art has finished
      const letters = Math.floor((t - ART_DONE) / TYPE_SPEED);
      setTyped(Math.max(0, Math.min(title.length, letters)));

      if (t < ART_DONE + title.length * TYPE_SPEED) {
        frame = requestAnimationFrame(tick);
      } else {
        onDoneRef.current?.(); // animation finished
      }
    };
    frame = requestAnimationFrame(tick);

    // stop the loop if the component goes away
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion]);

  return (
    <nav>
      {/* aria-hidden: screen readers would read every symbol, so skip the art */}
      <pre aria-hidden="true">{art}</pre>
      <h1 aria-label={title}>
        {title.slice(0, typed)}
        <span className="cursor" aria-hidden="true">_</span>
      </h1>
      {/* only shows if the models are slower than the intro.
          the line always takes up space so nothing jumps when it disappears */}
      <p className={loading ? "nav-status" : "nav-status is-hidden"} role="status">
        {loading ? `loading_happiness(); ${Math.round(progress)}%` : ""}
      </p>
    </nav>
  );
}
