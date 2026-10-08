import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  OrbitControls,
  Stage,
  useGLTF,
} from "@react-three/drei";

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
        {/* environment={null}: Stage's default "city" preset downloads a
            1.5 MB lighting image from github. we build our own below instead */}
        <Stage environment={null}>
          <Model url={url} />
        </Stage>
        {/* glowing panels around the model that light its reflections.
            made in code, so there's nothing to download */}
        <Environment resolution={256}>
          <Lightformer intensity={2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer intensity={2} position={[0, 5, 9]} scale={[10, 10, 1]} />
          <Lightformer intensity={1} rotation-y={Math.PI / 2} position={[-9, 2, 0]} scale={[10, 4, 1]} />
          <Lightformer intensity={1} rotation-y={-Math.PI / 2} position={[9, 2, 0]} scale={[10, 4, 1]} />
          <Lightformer intensity={1.5} rotation-x={Math.PI / 2} position={[0, 9, 0]} scale={[10, 10, 1]} />
        </Environment>
      </Suspense>
      <OrbitControls enableZoom={zoom} enablePan={zoom} />
    </Canvas>
  );
}



