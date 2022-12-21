<script lang="ts">
import { computed, onMounted, ref, defineProps } from "vue";
import type { IBrush } from "env";
import type { PropType } from "vue";
import { findIndex } from "lodash";
import { rectToClientRect } from "@floating-ui/core";
import { useConfigStore } from "../../stores/config";
import { useDataStore } from "@/stores/data";

export default {
  props: {
    distribution: {
      required: true,
      type: Array as PropType<number[]>,
    },
  },
  setup(props, ctx) {
    const input = ref("0");
    const editing = ref({
      left: 0,
      shown: false,
      tk: -1,
    });
    const config = useConfigStore();
    // const ticks = ref([
    //   {
    //     v: 0,
    //     key: 0,
    //     r: 0,
    //   },
    //   {
    //     v: 0.3,
    //     key: 2,
    //     r: 0,
    //   },
    //   {
    //     v: 1,
    //     key: 3,
    //     r: 1,
    //   },
    // ]);
    const max_v = computed(() => Math.max(...props.distribution));
    const sliderRef = ref(null);

    const onDragStart = (e: MouseEvent, t: { v: number; key: number }) => {
      const rect = (
        sliderRef.value as unknown as HTMLElement
      ).getBoundingClientRect();
      const i = findIndex(config.ticks, (tick) => tick.key === t.key);

      const handleMove = (e: MouseEvent) => {
        const x = e.pageX - rect.x;
        let v = x < 0 ? 0 : x / rect.width;
        v = v > 1 ? 1 : v;
        // ticks.value[i].v = v;
        config.setTickValue(i, v);
      };

      document.addEventListener("mousemove", handleMove);

      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", handleMove);
        // handleRefresh();
      });
    };

    const settingColor = (e: MouseEvent, t: { v: number; key: number }) => {
      // const rect = (
      //   sliderRef.value as unknown as HTMLElement
      // ).getBoundingClientRect();
      // const left = e.pageX - rect.left;
      const left = 80;
      editing.value = { left, shown: true, tk: t.key };
    };

    const confirm = (e: MouseEvent) => {
      const tk = editing.value.tk;
      const i = findIndex(config.ticks, (tick) => tick.key === tk);
      config.setTickRatio(i, parseFloat(input.value));
      // ticks.value[i].r = input.value;
      input.value = "0";
      editing.value.shown = false;
    };

    const addTick = (e: MouseEvent) => {
      const rect = (
        sliderRef.value as unknown as HTMLElement
      ).getBoundingClientRect();
      const v = (e.pageX - rect.x) / rect.width;
      config.addTick(v);
      // handleRefresh();

      // const key = ticks.value.length;
      // ticks.value.push({ v, key, r: v });
    };
    return {
      input,
      max_v,
      onDragStart,
      sliderRef,
      addTick,
      settingColor,
      editing,
      confirm,
      config,
    };
  },
};
</script>

<template>
  <div class="distribution">
    <div class="bars" @click="addTick">
      <div
        class="bar"
        v-for="(d, i) in distribution"
        :key="i"
        :style="{
          height: `calc(${(98 * d) / max_v}% + 1px)`,
        }"
      ></div>
    </div>
    <div class="slider" ref="sliderRef">
      <div
        class="tick"
        v-for="tick in config.ticks"
        :key="tick.key"
        @dblclick="settingColor($event, tick)"
        @mousedown.left="onDragStart($event, tick)"
        :style="{
          left: `calc(${tick.v * 100}% - 8px)`,
        }"
      ></div>
    </div>
    <div
      class="popup-input"
      v-show="editing.shown"
      :style="{
        left: `${editing.left}px`,
      }"
    >
      <el-input
        v-model="input"
        placeholder="Please input"
        maxlength="30"
        style="width: 80px"
      >
      </el-input>
      <div class="btn" @click="confirm">Set</div>
    </div>
  </div>
</template>

<style lang="scss">
.distribution {
  position: relative;
  height: 120px;
  width: 100%;
  background-color: #fff;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  padding: 10px;

  .popup-input {
    position: absolute;
    height: 40px;
    width: 150px;
    border: 1px solid #777;
    background-color: #fff;
    padding: 5px;
    z-index: 100;

    .btn {
      position: absolute;
      top: 8px;
      height: 22px;
      line-height: 22px;
      width: 50px;
      background-color: #777;
      color: #fff;
      left: 90px;
      border-radius: 5px;
      text-align: center;
      user-select: none;
      cursor: pointer;
    }
  }

  .bars {
    position: relative;
    height: 80px;
    width: 100%;
    display: flex;
    transform: scaleY(-1);

    .bar {
      flex: 1;
      background-color: #777;
    }
  }

  .slider {
    position: relative;
    height: 20px;
    width: 100%;

    .tick {
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-bottom: 16px solid #aaa;
      top: -8px;
      position: absolute;
    }
  }
}

input {
  width: 80px !important;
}
</style>
