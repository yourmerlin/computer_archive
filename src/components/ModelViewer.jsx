import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

// loads a .glb file and puts it in the scene
function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
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
