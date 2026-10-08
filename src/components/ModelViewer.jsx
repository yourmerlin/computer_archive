import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

function Model({ url }) {
  const { scene } = useGLTF(url);
  const copy = useMemo(() => scene.clone(), [scene]);
  return <primitive object={copy} />;
}

export default function ModelViewer({ url, zoom = false }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 40 }} frameloop="demand">
      {}
      <Suspense fallback={null}>
        {}
        <Stage>
          <Model url={url} />
        </Stage>
      </Suspense>
      <OrbitControls enableZoom={zoom} enablePan={zoom} />
    </Canvas>
  );
}



