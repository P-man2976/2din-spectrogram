import md5 from "md5";


export const deriveLastfmSignature = (params: Record<string, string | null | undefined>) => {

  return md5(
    Object.entries(params)
      .toSorted()
      .map(([key, val]) => val ? key + val : undefined)
      .join("") + import.meta.env.VITE_LASTFM_SECRET
  );
}