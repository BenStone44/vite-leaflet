<script lang="ts">
import { onMounted, ref } from "vue";
import "element-plus/es/components/slider/style/css";
export default {
  emits: ["chang-child"],
  props: {
    max: {
      required: true,
      type: Number,
    },
    step: {
      required: true,
      type: Number,
    },
    min: {
      required: true,
      type: Number,
    },
    default: {
      required: true,
      type: Number,
    },
    text: {
      required: true,
      type: String,
    },
    unit: {
      required: true,
      type: String,
    },
  },
  setup(props, ctx) {
    const v = ref(0);
    const formatTooltip = (val: number) => {
      return `${val}${props.unit}`;
    };
    const changeValue = (v: number) => {
      ctx.emit("chang-child", v);
    };

    onMounted(() => {
      v.value = props.default;
    });

    return {
      v,
      formatTooltip,
      changeValue,
    };
  },
};
</script>

<template>
  <div class="slider-container">
    <div class="name">
      <div class="text">{{ text }}</div>
    </div>
    <div class="my-slider">
      <el-slider
        v-model="v"
        :min="min"
        :max="max"
        :step="step"
        :format-tooltip="formatTooltip"
        :input-size="'small'"
        @change="changeValue"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.slider-container {
  position: relative;
  height: 40px;
  width: 100%;
  display: flex;

  .name {
    flex: 0 0 50px;
    position: relative;

    .text {
      position: relative;
      height: 30px;
      margin: 5px;
      width: calc(100% - 10px);
      line-height: 30px;
      border-right: 1px solid #eee;
    }
  }

  .my-slider {
    flex: 1;
    position: relative;
    height: 30px;
    padding: 5px 10px;
  }
}
</style>
