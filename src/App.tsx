import { Canvas, useThree } from "@react-three/fiber";

import { Physics } from "@react-three/rapier";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Bloom,
  EffectComposer,
  Outline,
  Selection,
} from "@react-three/postprocessing";
import { BlendFunction, Resolution } from "postprocessing";

import styled from "styled-components";

import { ACESFilmicToneMapping, Color, PCFSoftShadowMap } from "three";

import { Dominos } from "./Dominos";

export const AppWrapper = () => {
  const [showLoading, setShowLoading] = useState(true);
  return (
    <>
      <App setShowLoading={setShowLoading} />
    </>
  );
};

type AppProps = {
  setShowLoading: (b: boolean) => void;
};

const App = ({ setShowLoading }: AppProps) => {
  const [firstClick, setFirstClick] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    setShowLoading(false);
  }, []);

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("pointerdown", handleMouseDown);
    window.addEventListener("touchstart", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("pointerup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("pointerdown", handleMouseDown);
      window.removeEventListener("touchstart", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("pointerup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  });

  const handleMouseDown = () => {
    if (!firstClick) {
      setFirstClick(true);
    }

    setMouseDown(true);
  };

  const handleMouseUp = () => {
    setMouseDown(false);
  };

  return (
    <>
      <Anchor id='anchor' />

      {!firstClick && <ClickMe>Drag to draw</ClickMe>}

      <Canvas
        gl={{
          toneMappingExposure: 3,
          toneMapping: ACESFilmicToneMapping,
        }}
        shadows={{
          type: PCFSoftShadowMap,
        }}
        camera={{
          fov: 45,
          near: 10,
          far: 2500,
          position: [0, 118, 170],
        }}
      >
        <Suspense fallback={null}>
          <Selection>
            <EffectComposer autoClear={false} multisampling={8}>
              <Bloom
                luminanceThreshold={1}
                mipmapBlur
                resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
                resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
              />
              <Outline
                blur
                edgeStrength={20}
                blendFunction={BlendFunction.SCREEN} // set this to BlendFunction.ALPHA for dark outlines
                hiddenEdgeColor={0xffffff}
                visibleEdgeColor={0xffffff}
              />
            </EffectComposer>

            <Physics gravity={[0, -40, 0]}>
              <Dominos mouseDown={mouseDown} />
            </Physics>
          </Selection>
        </Suspense>
      </Canvas>
    </>
  );
};

const Anchor = styled.div`
  position: absolute;
  pointer-events: none;
  user-select: none;
  height: 100%;
  width: 100%;
`;

const DialogueAnchor = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  user-select: none;
  height: calc(100% - 100px);
  width: calc(100% - 100px);
  padding: 50px;
  z-index: 5;
`;

const DialogueBox = styled.div`
  padding: 70px;
  font-family: monospace;
  user-select: none;
  font-size: 30px;
  max-width: 40%;
  height: 200px;
  width: calc(100% - 140px);
  background: #00000044;
  color: #ffffff;
  position: relative;
  line-height: 60px;
`;

const DialogueCursor = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  height: 30px;
  width: 30px;
  background: #ffffff;
`;

const Blinker = () => {
  const [visible, setVisible] = useState(false);

  return <DialogueCursor style={{ opacity: visible ? 1 : 0 }} />;
};

const ClickMe = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  font-size: 26px;
  font-weight: 300;
  color: #f1f1f1;
  align-items: center;
  user-select: none;
  pointer-events: none;
  height: 100%;
  width: 100%;
  z-index: 100;
`;

export default App;
