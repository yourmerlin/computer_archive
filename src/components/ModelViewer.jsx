import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

// loads a .glb file and puts it in the scene
function Model({ url }) {
  // useGLTF downloads each file once and hands everyone the SAME model object.
  // a 3D object can only be in one scene at a time, so if the card and the
  // lightbox both used it, the lightbox would "steal" it from the card.
  // clone() gives each viewer its own copy. (it reuses the shapes and
  // textures, so it's cheap and doesn't download anything again.)
  const { scene } = useGLTF(url);
  const copy = useMemo(() => scene.clone(), [scene]);
  return <primitive object={copy} />;
}

// a small 3D scene. drag to rotate everywhere.
// zoom = true  -> scroll/pinch also zooms (used in the lightbox)
// zoom = false -> no zoom, so scrolling over a card still scrolls the page (grid)
export default function ModelViewer({ url, zoom = false }) {
  return (
    // frameloop="demand": only redraw when something changes (like a drag),
    // instead of 60 times a second. OrbitControls tells it when to redraw.
    <Canvas camera={{ position: [0, 0, 5], fov: 40 }} frameloop="demand">
      {/* Suspense shows nothing until the model finishes downloading */}
      <Suspense fallback={null}>
        {/* Stage adds lights and centers + scales the model to fit */}
        <Stage>
          <Model url={url} />
        </Stage>
      </Suspense>
      <OrbitControls enableZoom={zoom} enablePan={zoom} />
    </Canvas>
  );
}
