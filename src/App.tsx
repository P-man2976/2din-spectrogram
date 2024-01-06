import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Container } from "./components/Container";
import { Visualizer } from "./components/Visualizer";
import {
  audioBufferSourceAtom,
  audioContextAtom,
  audioFileAtom,
  audioMotionAnalyzerAtom,
} from "./atoms/audio";
import { useAtomCallback } from "jotai/utils";
import { useCallback } from "react";

function App() {
  const [audioBufferSource, refresh] = useAtom(audioBufferSourceAtom);
  const setAudioFile = useSetAtom(audioFileAtom);
  const audioContext = useAtomValue(audioContextAtom);
  const audioMotionAnalyzer = useAtomValue(audioMotionAnalyzerAtom);

  const getAudioBufferSource = useAtomCallback(
    useCallback((get) => get(audioBufferSourceAtom), [])
  );

  return (
    <>
      <Container>
        <Visualizer />
      </Container>
      {/* <Visualizer2 /> */}
      <input
        type="file"
        className="fixed top-0"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          refresh();
          const newBufferSource = getAudioBufferSource();
          setAudioFile(file);
          const audioBuffer = await audioContext.decodeAudioData(
            await file.arrayBuffer()
          );
          newBufferSource.buffer = audioBuffer;
          newBufferSource.start();
          audioMotionAnalyzer.start();
        }}
      />
    </>
  );
}

export default App;
