import { lastfmSessionAtom } from "@/atoms/lastfm";
import { deriveLastfmSignature } from "@/lib/lastfm";
import { Song } from "@/types/player";
import { useAtomValue } from "jotai";

export const useLastfmTracking = () => {
  const session = useAtomValue(lastfmSessionAtom);

  const startTrack = async ({
    title,
    track,
    album,
    artists,
    duration,
  }: Song) => {
    if (!title || !artists?.length || !session?.key) return;

    const params = {
      method: "track.updateNowPlaying",
      track: title,
      artist: artists?.join(","),
      album,
      trackNumber: track.no?.toString(),
      duration: duration ? Math.floor(duration).toString() : undefined,
      api_key: import.meta.env.VITE_LASTFM_APIKEY,
      sk: session.key,
    };

    console.log(`Start scrobbling ${title} on Last.fm`);

    const res = await fetch("http://ws.audioscrobbler.com/2.0", {
      method: "POST",
      body: Object.entries({
        ...params,
        format: "json",
        api_sig: deriveLastfmSignature(params),
      })
        .map(([k, v]) => v && `${k}=${v}`)
        .join("&"),
    });

    console.log(await res.text());
  };

  // const scrobble = async ({ title, track, album, artists, duration }: Song) => {
  //   if (!title || !artists?.length || !session?.key) return;

  //   const params = {
  //     method: "track.scrobble",
  //     track: title,
  //     artist: artists?.join(","),
  //     album,
  //     trackNumber: track.no?.toString(),
  //     duration: duration ? Math.floor(duration).toString() : undefined,
  //     api_key: import.meta.env.VITE_LASTFM_APIKEY,
  //     sk: session.key,
  //   };

  //   console.log(`Start scrobbling ${title} on Last.fm`);

  //   const res = await fetch("http://ws.audioscrobbler.com/2.0", {
  //     method: "POST",
  //     body: Object.entries({
  //       ...params,
  //       format: "json",
  //       api_sig: deriveLastfmSignature(params),
  //     })
  //       .map(([k, v]) => v && `${k}=${v}`)
  //       .join("&"),
  //   });

  //   console.log(await res.text());
  // };

  return { startTrack };
};
