import { useState } from "react";
import ModelViewer from "./ModelViewer.jsx";

// one card in the grid. name, lowModel and highModel are "props":
// values passed in from ComputerGrid, like attributes on an HTML tag.
export default function ComputerCard({ name, lowModel, highModel, onOpen }) {
  // state: something the card remembers. starts as false (show low model).
  const [showHigh, setShowHigh] = useState(false);

  return (
    <article className="computer-card" onClick={onOpen}>
      <div className="computer-card-model">
        <ModelViewer url={showHigh ? highModel : lowModel} />
      </div>
      <h2>{name}</h2>
      <button onClick={() => setShowHigh(!showHigh)}>
        {showHigh ? "show low quality" : "show high quality"}
      </button>
    </article>
  );
}
