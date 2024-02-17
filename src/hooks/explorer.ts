import {
  explorerAddressHistoryAtom,
  explorerAddressQueueAtom,
} from "@/atoms/explorer";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

export function useAddress() {
  const [history, setHistory] = useAtom(explorerAddressHistoryAtom);
  const [queue, setQueue] = useAtom(explorerAddressQueueAtom);

  const path = useMemo(() => history.at(-1), [history]);

  const push = useCallback(
    (path: string) => {
      setHistory((prev) => [...prev, path]);
      setQueue([]);
    },
    [setHistory, setQueue]
  );

  const back = useCallback(() => {
    setQueue((prev) => {
      const lastPath = history.at(-1);

      return lastPath ? [lastPath, ...prev] : prev;
    });
    setHistory((prev) => prev.slice(0, -1));
  }, [history, setQueue, setHistory]);

  const advance = useCallback(() => {
    if (queue[0]) setHistory((prev) => [...prev, queue[0]]);
    setQueue((prev) => prev.slice(1));
  }, [queue, setQueue, setHistory]);

  return { history, queue, path, push, back, advance };
}
