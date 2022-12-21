<script lang="ts">
export default {
  props: {
    width: {
      required: true,
      type: Number,
    },
    left: {
      required: true,
      type: Number,
    },
    text: {
      required: true,
      type: String,
    },
  },
};
</script>

<template>
  <div class="divider">
    <div class="divider-line"></div>
    <div
      class="divider-text"
      :style="{
        width: `${width}px`,
        left: `${left}px`,
      }"
    >
      {{ text }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.divider {
  position: relative;
  height: 40px;
  width: 100%;

  .divider-text {
    position: relative;
    height: 100%;
    text-align: center;
    background-color: #f7f7f7;
    font-weight: 600;
    font-size: 16px;
    line-height: 40px;
  }

  .divider-line {
    position: absolute;
    height: 0;
    width: 100%;
    border-top: 1px solid #777;
    top: 20px;
  }
}
</style>
