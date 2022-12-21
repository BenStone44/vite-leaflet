/// <reference types="vite/client" />

import type { type } from "os";

type Line = [{ [key: string]: number }, { [key: string]: number }];
type polutionSeries = { [key: string]: Array<number> };
type sessionInfo = {
  position_x: number; //左x值
  position_y: number; //上y值
  height: number; //session高度
  place_ids: Array<number>; //session中包含的地区id号
  selected: boolean;
  color: string;
};

type placeInfo = {
  color: Array<{
    session_id: string,
    color: string
  }>;
  location: lnglat;
  coords: Array<number>;
  values: Array<number>;
  grd: { [key: string]: CanvasGradient }
}

type DistanceAndCorrelationRange = {
  d: number,
  r: number
}

type IBrush = {
  x: number;
  y: number;
  x2: number;
  y2: number;
  active: boolean;
  [key: string]: number;
};

type loc = {
  lat: number;
  lng: number;
  rid: number;
};

type session = {
  id: string;
  parse: sessionInfo;
};

type lnglat = {
  lat: number;
  lng: number;
};

type SessionInfo = {
  s: number;
  ratios: number[];
  aggregated?: boolean;
};

type LocationInfo = {
  distribution: number[];
  sum: number;
  rid: number;
};
