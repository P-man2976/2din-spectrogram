import { ICommonTagsResult } from "music-metadata/lib/type";

export type Source = "file" | "radio" | "aux" | "off";
export interface Song
  extends Pick<
    ICommonTagsResult,
    "title" | "track" | "album" | "artists" | "genre" | "date" | "year"
  > {
  id: string;
  filename: string;
  url: string;
  artwork?: string;
}
