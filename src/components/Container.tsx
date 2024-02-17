import { StatsGl } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ReactNode } from "react";

export function Container({ children }: { children: ReactNode }) {
  return (
    <Canvas camera={{ fov: 120, position: [0, 0, 50] }}>
      {/* <OrthographicCamera makeDefault> */}
      <ambientLight color={0xffffff} intensity={Math.PI / 2} />
      {children}
      {/* </OrthographicCamera> */}
      <StatsGl minimal />
    </Canvas>
  );
}
