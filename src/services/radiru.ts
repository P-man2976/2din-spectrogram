import { useQuery } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/plugin-http";
import { XMLParser } from "fast-xml-parser";

const xmlParser = new XMLParser();

export function useRadiruStationList() {
  return useQuery({
    queryKey: ["radio", "radiru", "stations"],
    queryFn: async () => {
      const res = await fetch(
        "https://www.nhk.or.jp/radio/config/config_web.xml"
      );

      const config = xmlParser.parse(await res.text()) as RadiruConfig;

      return config.radiru_config.stream_url.data;
    },
  });
}
