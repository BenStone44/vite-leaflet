import { defineStore } from "pinia";
import type {
  sessionInfo,
  session,
  loc,
  polutionSeries,
  LocationInfo,
  DistanceAndCorrelationRange,
  placeInfo
} from "env";
import { parameters } from "../constants";
const { bg_width } = parameters;
import type * as d3 from "d3";
import { useConfigStore } from "./config";
import { forEach } from "lodash";

export const useDataStore = defineStore({
  id: "data",
  state: () => ({

    highlight: true,
    highlightColor: "red",

    clickSessionGetMap: true,

    align_session: {
      show: false,
      position: {
        x: 0,
        y: 0,
      },
    },

    locationInfos: [] as LocationInfo[],
    maxCountLocation: 0 as number,
    // colAdded: new Set() as Set<Number>,
    cols: [] as number[],
    tableHeaders: [
      { text: "1", selected: false, banned: false },
      { text: "2", selected: false, banned: false },
      { text: "3", selected: false, banned: false },
      { text: "4", selected: false, banned: false },
      { text: "5", selected: false, banned: false },
      { text: "6", selected: false, banned: false },
      { text: ">7", selected: false, banned: false },
    ],
  }),
  getters: {
  },
  actions: {

    async postSTThresholds(range: DistanceAndCorrelationRange) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ range }),
      };
      const resp = await fetch(
        "http://localhost:5000/postRangeThreshold",
        requestOptions
      );
      const { location_info_dict } = await resp.json();
      // console.log(location_info_dict);
      const rows: LocationInfo[] = [];
      forEach(location_info_dict, (list: number[], rid: number) => {
        rows.push({
          distribution: list,
          sum: list.reduce((partialSum, a) => partialSum + a, 0),
          rid,
        });
      });
      this.locationInfos = rows;
      // this.maxCountLocation = max
      this.updateMaxCount();
      // ctx.emit("set-location-info", rows);
      // ctx.emit("set-max-count-location", max);
      // locationInfos.value = rows;
      // max_count_location.value = max;

      // console.log("session and location infos updated!");
      // console.log(this.locationInfos);
    },

    setSortBy(i: number) {
      this.tableHeaders[i].selected = !this.tableHeaders[i].selected;
      this.sortLocations();
    },

    sortLocations() {
      this.locationInfos.sort((a, b) => {
        let va = 0;
        let vb = 0;
        this.tableHeaders.forEach((header, i) => {
          if (header.selected && !header.banned) {
            va += a.distribution[i];
            vb += b.distribution[i];
          }
        });
        return vb - va;
      });
    },

    updateMaxCount() {
      let max = 0;
      forEach(this.locationInfos, (locationInfo) => {
        // const local_max = Math.max(...list);
        locationInfo.distribution.forEach((v, i) => {
          if (!this.tableHeaders[i].banned) {
            max = v > max ? v : max;
          }
        });
      });
      this.maxCountLocation = max;
    },

    setBanned(i: number) {
      console.log("ban", i);
      this.tableHeaders[i].banned = !this.tableHeaders[i].banned;
      this.sortLocations();
      this.updateMaxCount();
    },
  },
});
