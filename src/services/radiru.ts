import { useQuery } from "@tanstack/react-query";
import { ResponseType, getClient } from "@tauri-apps/api/http";
import { XMLParser } from "fast-xml-parser";

const client = await getClient();
const xmlParser = new XMLParser();

export function useRadiruStationList() {
  return useQuery({
    queryKey: ["radio", "radiru", "stations"],
    queryFn: async () => {
      const res = await client.get<string>(
        "https://www.nhk.or.jp/radio/config/config_web.xml",
        {
          responseType: ResponseType.Text,
        }
      );

      const config = xmlParser.parse(res.data) as RadiruConfig;

      return config.radiru_config.stream_url.data;
    },
  });
}
