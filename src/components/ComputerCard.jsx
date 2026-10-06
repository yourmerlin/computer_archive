import { useState } from "react";
import ModelViewer from "./ModelViewer.jsx";

// one card in the grid. name, lowModel and highModel are "props":
// values passed in from ComputerGrid, like attributes on an HTML tag.
export default function ComputerCard({ name, lowModel, highModel, onOpen }) {
  // state: something the card remembers. starts as false (show low model).
  const [showHigh, setShowHigh] = useState(false);

  return (
    <article className="computer-card">
      <div className="computer-card-model">
        <ModelViewer url={showHigh ? highModel : lowModel} />
      </div>
      <h2>
        <pre>
          ("{name}") {"{"}
        </pre>
      </h2>
      <button onClick={() => setShowHigh(!showHigh)}>
        mouseClicked{showHigh ? "(lo-fi)" : "(hi-fi)"}
        {"}"}
      </button>
      {/* opens the lightbox: onOpen comes from ComputerGrid */}
      <button className="lightboxButton" onClick={onOpen}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path className="h61c-t" />
        </svg>
      </button>
    </article>
  );
}
