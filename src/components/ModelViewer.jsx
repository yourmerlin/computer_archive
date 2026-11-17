import { Suspense, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useProgress,
  Bounds,
  Center,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
  View,
} from "@react-three/drei";

function Model({ url }) {
  const { scene } = useGLTF(url);
  const copy = useMemo(() => scene.clone(), [scene]);
  return <primitive object={copy} />;
}

// what goes inside every 3D view: camera, lighting, the model, mouse controls.
// this replaces drei's <Stage>, which added shadows and loaded its own
// lighting file for every single card.
function ModelScene({ url, zoom }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />
      <ambientLight intensity={0.4} />
      <Suspense fallback={null}>
        {/* the "city" lighting file is downloaded once and shared by every view */}
        <Environment preset="city" />
        {/* Bounds + Center: center the model and zoom the camera to fit it,
            the part of <Stage> we actually want */}
        <Bounds fit clip observe margin={1.2} maxDuration={0.01}>
          <Center>
            <Model url={url} />
          </Center>
        </Bounds>
      </Suspense>
      <OrbitControls makeDefault enableZoom={zoom} enablePan={zoom} />
    </>
  );
}

// ---------- for the grid cards ----------
// instead of every card getting its own <canvas> (7 separate 3D engines!),
// each card is just a "window" into ONE shared canvas (<SharedCanvas /> below).
export function ModelView({ url }) {
  return (
    <View className="model-view">
      <ModelScene url={url} zoom={false} />
    </View>
  );
}

// wipe the whole canvas at the start of every frame. without this, an old
// drawing of a model (e.g. from before it was centered) could stay on screen
// underneath the new one, so you'd see two computers.
// priority 0 runs before the views draw (they use priority 1).
function ClearEachFrame() {
  useFrame((state) => state.gl.clear(true, true, true), 0);
  return null;
}

// with frameloop="demand" the canvas only redraws when something changes.
// redraw when: the page scrolls/resizes (the card "windows" move),
// the layout shifts (fonts, the grid appearing), or a model finishes loading.
function RedrawWhenNeeded() {
  const invalidate = useThree((state) => state.invalidate);
  const { loaded, active } = useProgress();

  useEffect(() => {
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate);
    const layout = new ResizeObserver(() => invalidate());
    layout.observe(document.body);
    return () => {
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
      layout.disconnect();
    };
  }, [invalidate]);

  // when loading changes, redraw now and again a moment later,
  // after the models have been centered and the camera fitted
  useEffect(() => {
    invalidate();
    const timer = setTimeout(() => invalidate(), 300);
    return () => clearTimeout(timer);
  }, [loaded, active, invalidate]);

  return null;
}

// the one canvas behind the whole grid. it covers the screen but lets clicks
// through; each <ModelView> draws its model in its own card's spot.
export function SharedCanvas() {
  return (
    <Canvas
      className="shared-canvas"
      frameloop="demand"
      eventSource={document.getElementById("root")}
    >
      <ClearEachFrame />
      <RedrawWhenNeeded />
      <View.Port />
    </Canvas>
  );
}

// ---------- for the lightbox ----------
// the lightbox is a single big view, so it keeps its own canvas
export default function ModelViewer({ url, zoom = false }) {
  return (
    <Canvas frameloop="demand">
      <ModelScene url={url} zoom={zoom} />
    </Canvas>
  );
}
