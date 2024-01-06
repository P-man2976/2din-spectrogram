import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshStandardMaterial } from "three";
import { atom, getDefaultStore, useAtomValue } from "jotai";
import { audioMotionAnalyzerAtom } from "../atoms/audio";
import { AnalyzerBarData } from "audiomotion-analyzer";

const spectrogramAtom = atom<AnalyzerBarData[] | null>(null);
const store = getDefaultStore();

const CELL_WIDTH = 6;
const CELL_HEIGHT = 1;
const ROW_CELL_COUNT = 18;
const COL_CELL_COUNT = 32;
const ROW_CELL_GAP = 2;
const COL_CELL_GAP = 0.8;

export function Visualizer() {
  const meshRef = useRef<THREE.Mesh>(null);
  const audioMotionAnalyzer = useAtomValue(audioMotionAnalyzerAtom);

  // useLayoutEffect(() => {
  //   meshRef.current?.position.set(
  //     -((CELL_WIDTH + ROW_CELL_GAP) * ROW_CELL_COUNT),
  //     0
  //   );
  // }, []);
  
  useFrame(({ gl, scene, camera }) => {
    store.set(spectrogramAtom, audioMotionAnalyzer.getBars());
    gl.render(scene, camera);
  });

  return (
    <mesh
      ref={meshRef}
      position={[-((CELL_WIDTH + ROW_CELL_GAP) * ROW_CELL_COUNT / 2), -((CELL_HEIGHT + COL_CELL_GAP) * COL_CELL_COUNT / 2), -10]}
      // position={[0, 0, 0]}
      // scale={0.1}
      rotation-x={(Math.PI / 180) * 5}
    >
      {Array.from({ length: ROW_CELL_COUNT }).map((_, rowIndex) =>
        Array.from({ length: COL_CELL_COUNT }).map((__, colIndex) => (
          <VisualizerCell
            key={rowIndex + colIndex}
            rowIndex={rowIndex}
            colIndex={colIndex}
          />
        ))
      )}
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
  const color = new THREE.Color();
  const meshMaterialRef = useRef<MeshStandardMaterial>(null);

  useFrame(() => {
    if (meshMaterialRef.current)
      meshMaterialRef.current.color = color.set(
        (store.get(spectrogramAtom)?.[Math.trunc(rowIndex / 2)].value[0] ?? 0) *
          32 >
          colIndex
          ? "#22d3ee"
          : "#3b0764"
      );
  });

  return (
    <mesh
      position={[
        (CELL_WIDTH + ROW_CELL_GAP) * (ROW_CELL_COUNT - rowIndex),
        (CELL_HEIGHT + COL_CELL_GAP) * (COL_CELL_COUNT - colIndex),
        0,
      ]}
    >
      <planeGeometry args={[CELL_WIDTH, CELL_HEIGHT, 1]} />
      <meshStandardMaterial ref={meshMaterialRef} />
    </mesh>
  );
}
