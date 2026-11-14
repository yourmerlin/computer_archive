import { useEffect, useRef, useState } from "react";

// each line of the footer, in order. "tag" is which html element it uses.
const lines = [
  { tag: "h1", text: "while (alive) {" },
  { tag: "p", text: "computer_will_love_you();" },
  { tag: "p", text: "made_with_love();" },
  { tag: "p", text: "by_merlin();" },
  { tag: "h1", text: "}" },
];

const TYPE_SPEED = 40; // milliseconds per letter
const LINE_PAUSE = 250; // little pause at the end of each line, like hitting enter

// total letters, so we know when typing is finished
const TOTAL = lines.reduce((sum, l) => sum + l.text.length, 0);

export default function Footer() {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const footerRef = useRef(null);
  // how many letters have been typed so far (across all lines)
  const [typed, setTyped] = useState(reduceMotion ? TOTAL : 0);
  const [started, setStarted] = useState(reduceMotion);

  // wait until the footer scrolls into view before starting
  useEffect(() => {
    if (started) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true);
        observer.disconnect(); // only animate the first time
      }
    }, { threshold: 0.4 }); // 40% of the footer visible
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, [started]);

  // type one letter at a time, pausing at the end of each line
  useEffect(() => {
    if (!started || typed >= TOTAL) return;

    // is the letter we just typed the last one on its line?
    let count = 0;
    let endOfLine = false;
    for (const l of lines) {
      count += l.text.length;
      if (typed === count) endOfLine = true;
    }

    const timer = setTimeout(
      () => setTyped(typed + 1),
      endOfLine ? LINE_PAUSE : TYPE_SPEED
    );
    return () => clearTimeout(timer);
  }, [started, typed]);

  // figure out what each line shows right now
  let remaining = typed;
  let cursorPlaced = false;

  return (
    <footer ref={footerRef}>
      {lines.map(({ tag: Tag, text }, i) => {
        const shown = Math.min(text.length, Math.max(0, remaining));
        remaining -= text.length;

        // the cursor sits on the line currently being typed
        // (or at the very end once everything is done)
        const isLast = i === lines.length - 1;
        const showCursor =
          !cursorPlaced && (shown < text.length || isLast);
        if (showCursor) cursorPlaced = true;

        return (
          <Tag key={i} aria-label={text}>
            <span aria-hidden="true">{text.slice(0, shown)}</span>
            {showCursor && started && (
              <span className="cursor" aria-hidden="true">_</span>
            )}
            {/* the untyped part is invisible but still takes up space,
                so the centered text doesn't slide around while typing */}
            <span className="untyped" aria-hidden="true">
              {text.slice(shown)}
            </span>
          </Tag>
        );
      })}
    </footer>
  );
}
