import { ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { WebviewWindow, getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { invoke } from "@tauri-apps/api/core";
import { Event } from "@tauri-apps/api/event";
import { useAtom } from "jotai";
import { lastfmSessionAtom } from "@/atoms/lastfm";
import { LuLogOut } from "react-icons/lu";
import { deriveLastfmSignature } from "@/lib/lastfm";
const appWindow = getCurrentWebviewWindow()

export function SettingsDialog({ children }: { children: ReactNode }) {
  const [lastfmSession, setLastfmSession] = useAtom(lastfmSessionAtom);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-[calc(100dvh_-_10rem)]">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl">設定</h2>
          <h3 className="text-lg">Ｌａｓｔ．ｆｍ連携</h3>
          {lastfmSession ? (
            <Button
              variant="outline"
              className="border-[#D51007] hover:bg-[#D5100755] gap-4"
              onClick={() => setLastfmSession(null)}
            >
              <LuLogOut />
              {lastfmSession.name}で連携中
            </Button>
          ) : (
            <Button
              className="bg-[#D51007aa] hover:bg-[#D51007dd]"
              onClick={async () => {
                const port = await invoke("start_server", {
                  window: appWindow,
                });
                const webview = new WebviewWindow("lastfm-auth", {
                  url: `https://last.fm/api/auth?${new URLSearchParams({
                    api_key: import.meta.env.VITE_LASTFM_APIKEY,
                    cb: `http://localhost:${port}`,
                  })}`,
                });

                appWindow.once(
                  "redirect_uri",
                  async ({ payload }: Event<string>) => {
                    const token = new URL(payload).searchParams.get("token");

                    if (!token) return;

                    const searchParams = {
                      api_key: import.meta.env.VITE_LASTFM_APIKEY,
                      method: "auth.getSession",
                      token,
                    };

                    const sign = deriveLastfmSignature(searchParams)

                    const res = await fetch(
                      `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams({
                        ...searchParams,
                        format: "json",
                        api_sig: sign,
                      })}`
                    );
                    const { session } = await res.json();

                    setLastfmSession(session);
                  }
                );

                webview.once("tauri://created", function () {
                  // webview window successfully created
                  console.log("created");
                });
              }}
            >
              Ｌａｓｔ．ｆｍと連携する
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
