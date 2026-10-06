import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

// loads a .glb file and puts it in the scene
function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

// a small 3D scene: drag to rotate, scroll to zoom.
export default function ModelViewer({ url }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
      {/* Suspense shows nothing until the model finishes downloading */}
      <Suspense fallback={null}>
        {/* Stage adds lights and centers + scales the model to fit */}
        <Stage>
          <Model url={url} />
        </Stage>
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}
