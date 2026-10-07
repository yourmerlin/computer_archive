import { useEffect, useState } from "react";
import ModelViewer from "./ModelViewer";

export default function Lightbox({ computer, onClose }) {
  // starts on lo-fi every time the lightbox opens
  const [showHigh, setShowHigh] = useState(false);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="lightbox" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>
          close
        </button>
        <h2>
          {computer.name}
          {"(){"}
        </h2>
        {/* reads like code: mouseClicked(hi-fi || lo-fi)}
            each mode is its own button; the active one gets the "active" class */}
        <p className="fidelity-toggle">
          mouseClicked(
          <button
            className={showHigh ? "active" : ""}
            onClick={() => setShowHigh(true)}
          >
            hi-fi
          </button>
          {" || "}
          <button
            className={showHigh ? "" : "active"}
            onClick={() => setShowHigh(false)}
          >
            lo-fi
          </button>
          ){"}"}
        </p>
        <ModelViewer
          url={showHigh ? computer.highModel : computer.lowModel}
          zoom
        />
      </div>
    </div>
  );
}
