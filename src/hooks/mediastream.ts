import { audioMotionAnalyzerAtom, mediaStreamAtom } from "@/atoms/audio";
import { useAtom, useAtomValue } from "jotai";

export const useMediaStream = () => {
  const audioMotionAnalyzer = useAtomValue(audioMotionAnalyzerAtom);
  const [mediaStream, setMediaStream] = useAtom(mediaStreamAtom);

  const connect = (stream: MediaStream) => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }

    const source =
      audioMotionAnalyzer.audioCtx.createMediaStreamSource(stream);

    const gainNode = audioMotionAnalyzer.audioCtx.createGain();
    gainNode.gain.value = 3; // 音量を50%

    source.connect(gainNode);

    audioMotionAnalyzer.volume = 0;

    // audioMotionAnalyzer.disconnectInput();
    audioMotionAnalyzer.connectInput(gainNode);
    audioMotionAnalyzer.start();
    setMediaStream(stream);
  };

  const disconnect = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }

    // 他ソースの初期化処理と競合するためコメントアウト
    // audioMotionAnalyzer.disconnectInput();
    // audioMotionAnalyzer.stop();
    setMediaStream(null);
  };

  return { connect, disconnect };
};
