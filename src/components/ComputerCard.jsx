import ModelViewer from "./ModelViewer.jsx";

// one card in the grid. name, lowModel and onOpen are "props":
// values passed in from ComputerGrid, like attributes on an HTML tag.
// the card always shows lo-fi. hi-fi is only in the lightbox.
export default function ComputerCard({ name, lowModel, onOpen }) {
  return (
    <article className="computer-card">
      <div className="computer-card-model">
        <ModelViewer url={lowModel} />
      </div>
      <h2>
        <pre>("{name}")</pre>
      </h2>
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
