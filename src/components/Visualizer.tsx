import * as THREE from "three";
import { Fragment, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshStandardMaterial } from "three";
import { atom, getDefaultStore, useAtomValue } from "jotai";
import { audioMotionAnalyzerAtom } from "../atoms/audio";
import { AnalyzerBarData } from "audiomotion-analyzer";
import { Line, Plane, Text } from "@react-three/drei";

const spectrogramAtom = atom<AnalyzerBarData[] | null>(null);
const store = getDefaultStore();

const CELL_WIDTH = 6;
const CELL_HEIGHT = 1;
const ROW_CELL_COUNT = 18;
const COL_CELL_COUNT = 32;
const ROW_CELL_GAP = 2;
const COL_CELL_GAP = 0.6;

const FREQ_ARRAY = ["60", "120", "250", "500", "1k", "2k", "4k", "8k", "16k"];

const ANALYZER_ANGLE_DEGREE = 24;

export function Visualizer() {
  const meshRef = useRef<THREE.Mesh>(null);
  const audioMotionAnalyzer = useAtomValue(audioMotionAnalyzerAtom);

  // useLayoutEffect(() => {
  //   meshRef.current?.position.set(
  //     -((CELL_WIDTH + ROW_CELL_GAP) * ROW_CELL_COUNT),
  //     0
  //   );
  // }, []);

  useFrame(() => {
    store.set(spectrogramAtom, audioMotionAnalyzer.getBars());
  });

  return (
    <mesh
      ref={meshRef}
      position={[
        -(
          ((CELL_WIDTH + ROW_CELL_GAP) * ROW_CELL_COUNT - ROW_CELL_GAP + 80) /
          2
        ),
        -(((CELL_HEIGHT + COL_CELL_GAP) * COL_CELL_COUNT - COL_CELL_GAP) / 2),
        0,
      ]}
      // position={[0, 0, 0]}
      scale={1.6}
      rotation-x={(Math.PI / 180) * -ANALYZER_ANGLE_DEGREE}
    >
      {Array.from({ length: ROW_CELL_COUNT }).map((_, rowIndex) => (
        <Fragment key={`freq-${rowIndex}`}>
          {Array.from({ length: COL_CELL_COUNT }).map((__, colIndex) => (
            <VisualizerCell
              key={rowIndex + colIndex}
              rowIndex={rowIndex}
              colIndex={colIndex}
            />
          ))}
          <mesh
            key="freq-number"
            rotation-x={(Math.PI / 180) * ANALYZER_ANGLE_DEGREE}
          >
            <Line
              points={[
                [
                  (CELL_WIDTH + ROW_CELL_GAP) * rowIndex -
                    ROW_CELL_GAP / 2 +
                    (rowIndex % 2 === 0 ? 0.3 : 2),
                  -2,
                  0,
                ],
                [
                  (CELL_WIDTH + ROW_CELL_GAP) * rowIndex -
                    ROW_CELL_GAP / 2 +
                    CELL_WIDTH -
                    (rowIndex % 2 === 0 ? 2 : 0.3),
                  -2,
                  0,
                ],
              ]}
              linewidth={4}
              color="#67e8f9"
            />
            <Text
              color="#10b981"
              fontSize={2.4}
              font="https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-600-normal.woff"
              position={[
                (CELL_WIDTH + ROW_CELL_GAP) * rowIndex - ROW_CELL_GAP,
                -2,
                0,
              ]}
            >
              {FREQ_ARRAY[(rowIndex - 1) / 2]}
            </Text>
          </mesh>
        </Fragment>
      ))}
      {/* <mesh>
        <planeGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color='red' />
      </mesh> */}
    </mesh>
  );
}

function VisualizerCell({
  rowIndex,
  colIndex,
}: {
  rowIndex: number;
  colIndex: number;
}) {
  const color = useMemo(() => new THREE.Color(), []);
  const meshMaterialRef = useRef<MeshStandardMaterial>(null);

  useFrame(() => {
    if (meshMaterialRef.current) {
      const freqLevel = store.get(spectrogramAtom)?.[Math.trunc(rowIndex / 2)];

      meshMaterialRef.current.color = color.set(
        (freqLevel?.value[0] ?? 0) * 32 > colIndex ? "#a5f3fc" : "#3b0764"
      );

      if (
        (colIndex < (freqLevel?.peak[0] ?? 0) * 32 &&
          (freqLevel?.peak[0] ?? 0) * 32 < colIndex + 1) ||
        (colIndex - 2 < (freqLevel?.peak[0] ?? 0) * 32 &&
          (freqLevel?.peak[0] ?? 0) * 32 < colIndex - 1)
      ) {
        meshMaterialRef.current.color = color.set("#3b82f6");
      }
    }
  });

  return (
    <Plane
      position={[
        (CELL_WIDTH + ROW_CELL_GAP) * rowIndex + ROW_CELL_GAP,
        (CELL_HEIGHT + COL_CELL_GAP) * colIndex + COL_CELL_GAP,
        0,
      ]}
      args={[CELL_WIDTH, CELL_HEIGHT, 1]}
    >
      <meshStandardMaterial ref={meshMaterialRef} />
    </Plane>
  );
}
