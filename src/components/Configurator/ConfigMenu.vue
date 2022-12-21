<script lang="ts">
import { onMounted, ref } from "vue";

import BarChart from "./BarChart.vue";
import RowsChart from "./RowsChart.vue";

import Divider from "./Divider.vue";
import SliderChart from "./SliderChart.vue";
import { useDataStore } from "@/stores/data";
// const BrushRectEle = defineCustomElement(BrushRect);

export default {
  components: {
    BarChart,
    RowsChart,
    Divider,
    SliderChart,
  },
  setup() {
    const dataStore = useDataStore();
    const tssBins = ref([] as number[]);
    const isOpen = ref(false);
    const global_d = ref(400);
    const global_r = ref(0.7);

    const trigger = () => {
      if (isOpen.value) {
        isOpen.value = false;
      } else {
        isOpen.value = true;
      }
    };

    const setD = (d: number) => {
      global_d.value = d;
    };

    const setR = (r: number) => {
      global_r.value = r;
    };

    const postSTThresholdsLocal = () => {
      dataStore.postSTThresholds({ r: global_r.value, d: global_d.value });
    };

    onMounted(() => {
      fetch("value_bins.json")
        .then((response) => response.json())
        .then((data) => {
          tssBins.value = data;
        });
      // postSTThresholdsLocal();
    });

    return {
      postSTThresholdsLocal,
      tssBins,
      trigger,
      isOpen,
      setD,
      setR,
      global_d,
      global_r,
    };
  },
};
</script>

<template>
  <div class="configurator" ref="canvas">
    <div class="vis" :class="{ opened: isOpen }">
      <div class="vis-top vis-component">
        <Divider :width="120" :left="100" :text="'Distribution'" />
        <BarChart :distribution="tssBins" />
      </div>
      <div class="vis-middle vis-component">
        <Divider :width="200" :left="60" :text="'Correlation vs Distance'" />
        <!-- <Heatmap /> -->
        <div class="threshold-setting">
          <SliderChart
            :text="'corr.'"
            :max="1"
            :min="0"
            :default="global_r"
            :step="0.01"
            :unit="''"
            @chang-child="setR"
          />
          <SliderChart
            :text="'dist.'"
            :max="4600"
            :min="0"
            :default="global_d"
            :step="5"
            :unit="'km'"
            @chang-child="setD"
          />
          <div class="btn-wrapper">
            <div class="btn" @click="postSTThresholdsLocal">POST</div>
          </div>
        </div>
      </div>
      <div class="vis-bottom vis-component">
        <Divider :width="160" :left="80" :text="'Size of Sessions'" />
        <RowsChart />
      </div>
      <div class="vis-bottom-2 vis-component">
        <Divider :width="120" :left="100" :text="'Shape'" />
        <div class="threshold-setting">
          <SliderChart
            :text="'corr.'"
            :max="1"
            :min="0"
            :default="0.65"
            :step="0.01"
            :unit="''"
          />
          <SliderChart
            :text="'dist.'"
            :max="4600"
            :min="0"
            :default="600"
            :step="5"
            :unit="'km'"
          />
          <div class="btn-wrapper">
            <div class="btn">POST</div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel">
      <el-icon @click="trigger" :size="46" color="#fff" style="top: 2px">
        <Expand />
      </el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.configurator {
  position: relative;
  top: 0;
  left: 0;
  width: 50px;
  height: 100%;
  z-index: 1000;
  float: left;

  .panel {
    position: relative;
    background: #47b5ff;
    width: 100%;
    height: 100%;
    z-index: 2;
  }

  .vis {
    position: absolute;
    top: 0;
    width: 350px;
    left: -300px;
    height: 100%;
    background: #f7f7f7;
    // border-right: 1px solid #aaa;
    transition: left 300ms;
    overflow: hidden;
    box-shadow: rgba(136, 165, 191, 0.48) 6px 2px 16px 0px,
      rgba(255, 255, 255, 0.8) -6px -2px 16px 0px;

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

    .vis-component {
      position: relative;
      width: calc(100% - 30px);
      margin: 15px;
      margin-bottom: 20px;

      .threshold-setting {
        height: 110px;
        width: 100%;
        position: relative;
        background-color: #fff;
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

        .btn-wrapper {
          position: relative;
          height: 30px;
          width: 100%;

          .btn {
            cursor: pointer;
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
    }

    .vis-top {
      height: 160px;
    }

    .vis-middle {
      // height: 270px;
      height: 150px;
    }

    .vis-bottom {
      height: 400px;
    }

    .vis-bottom {
      height: 430px;
    }

    .vis-bottom-2 {
      height: 80px;
    }
  }

  .opened {
    left: 50px !important;
    border-right: 1px solid #aaa;
  }
}
</style>
