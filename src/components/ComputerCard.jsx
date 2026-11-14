import { ModelView } from "./ModelViewer.jsx";

// one card in the grid. name, lowModel and onOpen are "props":
// values passed in from ComputerGrid, like attributes on an HTML tag.
// the card always shows lo-fi. hi-fi is only in the lightbox.
export default function ComputerCard({ name, year, link, lowModel, onOpen }) {
  return (
    <article className="computer-card">
      <div className="computer-card-model">
        <ModelView url={lowModel} />
      </div>
      <h2>
        {/* the link sits inside <pre> (inline inside a block) so the hover
            underline works. target="_blank" opens it in a new tab;
            rel="noopener noreferrer" stops that tab from controlling this one.
            no link yet ("" in the json)? then it's just plain text */}
        <pre>
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer">
              ("{name}")
            </a>
          ) : (
            <>("{name}")</>
          )}
        </pre>
      </h2>
      <p>
        <pre>[{year}]</pre>
      </p>
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
