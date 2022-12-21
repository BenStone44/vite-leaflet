<script lang="ts">
import { computed, onMounted, ref, defineCustomElement } from "vue";
import type { DistanceAndCorrelationRange, IBrush, LocationInfo } from "env";
import { forEach } from "lodash";
import BrushRect from "./BrushRect.vue";
import { useDataStore } from "@/stores/data";

export default {
  // props: {
  //   width: {
  //     required: true,
  //     type: Number,
  //   },
  //   left: {
  //     required: true,
  //     type: Number,
  //   },
  //   text: {
  //     required: true,
  //     type: String,
  //   },
  // },
  components: {
    BrushRect,
  },
  setup(props, ctx) {
    const dataStore = useDataStore()

    const r_max_v = 1;
    const r_min_v = -1;
    const d_min_v = 12;
    const d_max_v = 4600;
    const width_px = ref(300);
    const height_px = ref(199);
    const dScale = (wpx: number) =>
      ((d_max_v - d_min_v) * wpx) / width_px.value + d_min_v;
    const rScale = (hpx: number) =>
      ((r_max_v - r_min_v) * hpx) / height_px.value + r_min_v;
    const imgWrapper = ref(HTMLElement);

    const brushes = ref([
      { x: 39, y: 165, x2: 0, y2: 199, active: true },
    ] as IBrush[]);
    const brushStyles = computed(() => {
      return brushes.value.map((brush) => ({
        left: `${Math.min(brush.x, brush.x2)}px`,
        top: `${Math.min(brush.y, brush.y2)}px`,
        width: `${Math.abs(brush.x - brush.x2)}px`,
        height: `${Math.abs(brush.y - brush.y2)}px`,
      }));
    });
    const ranges = computed(() => {
      return brushes.value.map((brush) => {
        const r1 = rScale(brush.y);
        const r2 = rScale(brush.y2);
        const d1 = dScale(brush.x);
        const d2 = dScale(brush.x2);
        return {
          dRange: [Math.min(d1, d2), Math.max(d1, d2)],
          rRange: [Math.min(r1, r2), Math.max(r1, r2)],
        } as DistanceAndCorrelationRange;
      });
    });

    const onDoubleClickImg = () => {
      brushes.value = [];
    };

    const onMouseDownImg = (e: MouseEvent) => {
      const nBrushes = brushes.value.length;
      const rect = (
        imgWrapper.value as unknown as HTMLElement
      ).getBoundingClientRect();
      // console.log(rect);
      brushes.value = [
        ...brushes.value,
        {
          x: e.pageX - rect.x,
          y: e.pageY - rect.y,
          x2: e.pageX - rect.x,
          y2: e.pageY - rect.y,
          active: true,
        } as IBrush,
      ];

      const handleMove = (e: MouseEvent) => {
        let x2 = e.pageX - rect.x;
        let y2 = e.pageY - rect.y;
        x2 = x2 > 0 ? x2 : 0;
        y2 = y2 > 0 ? y2 : 0;
        x2 = x2 > rect.width ? rect.width : x2;
        y2 = y2 > rect.height ? rect.height : y2;
        // console.log(y2, rect.height + rect.y);
        brushes.value[nBrushes].x2 = x2;
        brushes.value[nBrushes].y2 = y2;
      };

      document.addEventListener("mousemove", handleMove);

      document.addEventListener("mouseup", () => {
        console.log(brushes.value);
        document.removeEventListener("mousemove", handleMove);
      });
    };

    const setThresholds = () => {
      dataStore.postSTThresholds(ranges.value[0])
    };

    const resizeBrushParent = ({
      brushIndex,
      e,
      param,
    }: {
      brushIndex: number;
      e: MouseEvent;
      param: string;
    }) => {
      const rect = (
        imgWrapper.value as unknown as HTMLElement
      ).getBoundingClientRect();
      // console.log(brushIndex, e, param);

      let key = "";
      if (param === "y") {
        const initialY = e.pageY - rect.y;
        if (
          Math.abs(initialY - brushes.value[brushIndex].y) <
          Math.abs(initialY - brushes.value[brushIndex].y2)
        ) {
          key = "y";
        } else {
          key = "y2";
        }
      } else {
        const initialX = e.pageX - rect.x;
        if (
          Math.abs(initialX - brushes.value[brushIndex].x) <
          Math.abs(initialX - brushes.value[brushIndex].x2)
        ) {
          key = "x";
        } else {
          key = "x2";
        }
      }

      const handleMove = (e: MouseEvent) => {
        if (param === "y") {
          brushes.value[brushIndex][key] = e.pageY - rect.y;
        }
        if (param === "x") {
          brushes.value[brushIndex][key] = e.pageX - rect.x;
        }
      };

      document.addEventListener("mousemove", handleMove);

      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", handleMove);
      });
    };

    onMounted(() => {
      const rect = (
        imgWrapper.value as unknown as HTMLElement
      ).getBoundingClientRect();
      width_px.value = rect.width;
      height_px.value = rect.height;
    });

    return {
      resizeBrushParent,
      onMouseDownImg,
      imgWrapper,
      brushStyles,
      onDoubleClickImg,
      setThresholds,
      ranges,
    };
  },
};
</script>

<template>
  <div class="vis-middle-content">
    <div class="img-wrapper">
      <div
        @mousedown="onMouseDownImg"
        @dblclick="onDoubleClickImg"
        ref="imgWrapper"
        class="div-img"
      ></div>
      <BrushRect
        @resizeBrush="resizeBrushParent"
        v-for="(brushStyle, i) in brushStyles"
        :key="i"
        :brushIndex="i"
        :brushStyle="brushStyle"
      />
    </div>
    <div class="result-wrapper">
      <div class="range-result" v-for="(r, i) in ranges" :key="i">
        <div class="result">
          <div class="attr box">r :</div>
          <div class="value box">
            {{
              `[${Math.round(r.rRange[0] * 100) / 100}, ${
                Math.round(r.rRange[1] * 100) / 100
              }]`
            }}
          </div>
        </div>
        <div class="result">
          <div class="attr box">d :</div>
          <div class="value box">
            {{ `[${Math.round(r.dRange[0])}km, ${Math.round(r.dRange[1])}km]` }}
          </div>
        </div>
      </div>
    </div>
    <div class="btn-wrapper">
      <div class="btn" @click="setThresholds">POST</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vis-middle-content {
  position: relative;
  // height: 50px;
  width: 100%;
  height: calc(100% - 40px);
  background-color: #fff;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  // display: flex;
  // flex-direction: column;

  .img-wrapper {
    position: relative;
    // top: calc(100% - 199px);
    height: 230px;
    width: 300px;

    .div-img {
      position: relative;
      height: 199px;
      width: 300px;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      background-image: url("../../assets/heatmap.jpg");
      // background-size: 298px 197px;
      // pointer-events: none;
      // user-select: none;
      // cursor: none;
    }
  }

  .result-wrapper {
    position: relative;
    height: 60px;
    width: 100%;

    .range-result {
      position: relative;
      height: 20px;
      width: 100%;
      display: flex;

      .result {
        flex: 1;
        display: flex;

        .attr {
          flex: 0 0 30px;
          padding-left: 4px;
          line-height: 20px;
        }

        .value {
          flex: 1;
          padding-left: 4px;
          line-height: 20px;
        }
      }
    }
  }

  .btn-wrapper {
    position: relative;
    height: 30px;
    width: 100%;

    .btn {
      position: relative;
      margin: auto;
      height: 26px;
      width: 100px;
      border-radius: 5px;
      color: #fff;
      background-color: #777;
      text-align: center;
      line-height: 26px;
    }
  }
}
</style>
