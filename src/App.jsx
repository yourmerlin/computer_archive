// App is the whole page. it's built out of smaller components,
// the same way home.html was built out of <nav> and <main>.
import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import ComputerGrid from "./components/ComputerGrid.jsx";
import CursorTrail from "./components/CursorTrail.jsx";

// if something goes wrong loading, show the page anyway after this long
const GIVE_UP_AFTER = 20000; // milliseconds

export default function App() {
  // useProgress watches every 3D file three.js is loading (models + lighting)
  const { active, loaded, total, progress } = useProgress();

  const [introDone, setIntroDone] = useState(false); // header animation finished?
  const [modelsReady, setModelsReady] = useState(false); // all models loaded + drawn?

  useEffect(() => {
    if (modelsReady) return; // once ready, stay ready (opening hi-fi later won't hide the grid)

    if (!active && total > 0 && loaded === total) {
      // files are loaded; wait two frames so the models are actually drawn
      // on screen before we reveal them
      let frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setModelsReady(true));
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [active, loaded, total, modelsReady]);

  // safety net: never leave the page blank forever
  useEffect(() => {
    const timer = setTimeout(() => setModelsReady(true), GIVE_UP_AFTER);
    return () => clearTimeout(timer);
  }, []);

  // the grid only appears when BOTH the intro and the models are done
  const showSite = introDone && modelsReady;

  return (
    <>
      <CursorTrail />
      <Nav
        onIntroDone={() => setIntroDone(true)}
        loading={introDone && !modelsReady}
        progress={progress}
      />
      {/* the grid is on the page (so the models load) but invisible until ready */}
      <main className={showSite ? "home-main is-ready" : "home-main"}>
        <ComputerGrid />
      </main>
      <Footer />
    </>
  );
}
