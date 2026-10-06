import { useEffect } from "react";
import ModelViewer from "./ModelViewer";

export default function Lightbox({ computer, onClose }) {
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
        <h2>{computer.name}</h2>
        <ModelViewer url={computer.highModel} interactive />
      </div>
    </div>
  );
}
