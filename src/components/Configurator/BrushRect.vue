<script lang="ts">
import { computed, onMounted, ref, defineProps } from "vue";
import type { IBrush } from "env";
import type { PropType } from "vue";

export default {
  props: {
    brushIndex: {
      required: true,
      type: Number,
    },
    brushStyle: {
      required: true,
      type: Object as PropType<{
        left: string;
        top: string;
        width: string;
        height: string;
      }>,
    },
  },
  setup(props, ctx) {
    const triggerDragY = (e: MouseEvent) => {
      e.stopPropagation();
      ctx.emit("resizeBrush", { brushIndex: props.brushIndex, e, param: "y" });
    };

    const triggerDragX = (e: MouseEvent) => {
      e.stopPropagation();
      ctx.emit("resizeBrush", { brushIndex: props.brushIndex, e, param: "x" });
    };

    return {
      triggerDragY,
      triggerDragX,
    };
  },
};
</script>

<template>
  <div class="brush" :style="brushStyle">
    <div class="top h-border" style="top: 0px" @mousedown="triggerDragY"></div>
    <div
      class="right v-border"
      style="left: 100%"
      @mousedown="triggerDragX"
    ></div>
    <div
      class="left v-border"
      style="left: 0px"
      @mousedown="triggerDragX"
    ></div>
    <div
      class="bottom h-border"
      style="top: 100%"
      @mousedown="triggerDragY"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.brush {
  position: absolute;
  // border: 1px solid red;

  .h-border {
    position: absolute;
    height: 0px;
    width: 100%;
    border-top: 2px solid red;
    cursor: row-resize;
  }

  .v-border {
    position: absolute;
    width: 0px;
    height: 100%;
    border-right: 2px solid red;
    cursor: col-resize;
  }
}
</style>
