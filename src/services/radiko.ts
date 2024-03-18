import { useQuery } from "@tanstack/react-query";
import { ResponseType, getClient } from "@tauri-apps/api/http";
import { Parser as M3U8Parser } from "m3u8-parser";
import { XMLParser } from "fast-xml-parser";

const client = await getClient();
const xmlParser = new XMLParser();

export function useRadikoToken() {
  return useQuery({
    queryKey: ["radio", "radiko", "token"],
    queryFn: async () => {
      const authKey = "bcd151073c03b352e1ef2fd66c32209da9ca0afa";

      const resAuth1 = await client.get("https://radiko.jp/v2/api/auth1", {
        responseType: ResponseType.Text,
        headers: {
          "X-Radiko-App": "pc_html5",
          "X-Radiko-App-Version": "0.0.1",
          "X-Radiko-Device": "pc",
          "X-Radiko-User": "dummy_user",
        },
      });

      if (resAuth1.status !== 200)
        throw new Error("[Error] Radiko Auth1 failed", { cause: resAuth1 });

      const authToken = resAuth1.headers["x-radiko-authtoken"];
      const keyLength = Number(resAuth1.headers["x-radiko-keylength"]);
      const keyOffset = Number(resAuth1.headers["x-radiko-keyoffset"]);
      const partialKey = btoa(authKey.slice(keyOffset, keyOffset + keyLength));

      if (!authToken)
        throw new Error("[Error] Failed to get X-Radiko-AuthToken");

      const resAuth2 = await client.get("https://radiko.jp/v2/api/auth2", {
        responseType: ResponseType.Text,
        headers: {
          "X-Radiko-AuthToken": authToken,
          "X-Radiko-PartialKey": partialKey,
          "X-Radiko-Device": "pc",
          "X-Radiko-User": "dummy_user",
        },
      });

      if (resAuth2.status !== 200)
        throw new Error("[Error] Radiko Auth2 failed", { cause: resAuth2 });

      console.log("[Server] Radiko auth token refreshed");

      return authToken;
    },
    refetchInterval: 1000 * 60 * 8,
  });
}

export function useRadikoArea() {
  return useQuery({
    queryKey: ["radio", "radiko", "area"],
    queryFn: async () => {
      const res = await client.get<string>("https://radiko.jp/area", {
        responseType: ResponseType.Text,
      });

      const areaCode = (res.data).match(/class="(.*)"/)?.[1];

      return areaCode;
    },
  });
}

export function useRadikoStationList(areaId?: string) {
  const { data } = useRadikoArea();

  return useQuery({
    queryKey: ["radio", "radiko", areaId ?? data, "stations"],
    queryFn: async () => {
      const res = await client.get<string>(
        `https://radiko.jp/v3/station/list/${areaId ?? data}.xml`,
        { responseType: ResponseType.Text }
      );

      return xmlParser.parse(res.data).stations.station as RadikoStation[];
    },
    enabled: !!(areaId ?? data),
  });
}

export function useRadikoM3u8Url(stationId: string) {
  const { data: token } = useRadikoToken();

  return useQuery({
    queryKey: ["radio", "radiko", stationId, "m3u8"],
    queryFn: async () => {
      const m3u8Parser = new M3U8Parser();
      m3u8Parser.push(
        (
          await client.get(
            `https://si-f-radiko.smartstream.ne.jp/so/playlist.m3u8?station_id=${stationId}&type=b&l=15&lsid=11cbd3124cef9e8004f9b5e9f77b66`,
            {
              headers: { "X-Radiko-AuthToken": token },
              responseType: ResponseType.Text,
            }
          )
        ).data
      );
      m3u8Parser.end();

      return m3u8Parser.manifest.playlists[0].uri;
    },
    staleTime: 0,
    enabled: !!token,
  });
}
