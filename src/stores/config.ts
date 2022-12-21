import { defineStore } from "pinia";

const compare = (
  x: { v: number; key: number; r: number },
  y: { v: number; key: number; r: number }
) => {
  if (x.v > y.v) {
    return 1;
  } else return -1;
};

export const useConfigStore = defineStore({
  id: "config",
  state: () => ({
    counter: 0,
    ticks: [
      {
        v: 0,
        key: 0,
        r: 0,
      },
      {
        v: 0.05,
        key: 2,
        r: 0,
      },
      {
        v: 0.3,
        key: 3,
        r: 1,
      },
      {
        v: 1,
        key: 4,
        r: 1,
      },
    ],
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
    sortedTicks: (state) => state.ticks.sort(compare),
  },
  actions: {
    increment() {
      this.counter++;
    },
    addTick(v: number) {
      const key = this.ticks.length;

      this.ticks.push({ v, key, r: v });
    },
    setTickValue(i: number, v: number) {
      this.ticks[i].v = v;
    },
    setTickRatio(i: number, r: number) {
      this.ticks[i].r = r;
    },
  },
});
