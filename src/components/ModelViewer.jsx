import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

// loads a .glb file and puts it in the scene
function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

// a small 3D scene.
// interactive = true  -> drag to rotate, scroll/pinch to zoom (used in the lightbox)
// interactive = false -> still preview (used in the grid, so phones can scroll past it)
export default function ModelViewer({ url, interactive = false }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
      {/* Suspense shows nothing until the model finishes downloading */}
      <Suspense fallback={null}>
        {/* Stage adds lights and centers + scales the model to fit */}
        <Stage>
          <Model url={url} />
        </Stage>
      </Suspense>
      {interactive && <OrbitControls />}
    </Canvas>
  );
}
