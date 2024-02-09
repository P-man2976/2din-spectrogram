import { Container } from "../components/Container";
import { Visualizer } from "../components/Visualizer";
import { Outlet } from "react-router-dom";
import { DotMatrixArray } from "../components/DotMatrix";
import { Controls } from "../components/Controls";

export function Home() {
  return (
    <>
      <Container>
        <DotMatrixArray />
        <Visualizer />
      </Container>
      <Outlet />
      <Controls />
    </>
  );
}
