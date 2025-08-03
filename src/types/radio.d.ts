type RadioType = "AM" | "FM";

type Radio = (
  | {
      type: RadioType;
      source: "radiko";
      id: string;
    }
  | {
      type: RadioType;
      source: "radiru";
      url: string;
    }
) & {
  name: string;
  frequency?: number;
  logo?: string;
  channel?: number;
};

interface RadikoStation {
  id: string;
  name: string;
  ascii_name: string;
  ruby: string;
  areafree: 0 | 1;
  timefree: 0 | 1;
  logo: string[];
  banner: string;
  href: string;
  simul_max_delay: number;
  tf_max_delay: number;
}

interface RadiruConfig {
  radiru_config: {
    info: string;
    stream_url: {
      data: RadiruStation[];
    };
    url_program_noa: string;
    url_program_day: string;
    url_program_detail: string;
    radiru_twitter_timeline: string;
  };
}

interface RadiruStation {
  areajp: string;
  area: RadiruAreaId;
  apikey: number;
  areakey: number;
  r1hls: string;
  r2hls: string;
  fmhls: string;
}

interface FrequencyList {
  [key: string]: FrequencyStation;
}

type FrequencyStation =
  | {
      area: string[];
      type: "AM";
      name: string;
      frequencies_fm?: FrequencyArea[];
      frequencies_am: FrequencyArea[];
    }
  | {
      area: string[];
      type: "FM";
      name: string;
      frequencies_fm: FrequencyArea[];
      frequencies_am?: never;
    };

interface FrequencyArea {
  area: string[];
  frequency: number;
  primary: boolean;
}
