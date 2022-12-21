<script lang="ts">
import { ref } from "vue";
import { useDataStore } from "../../stores/data";

export default {
  setup() {
    const dataStore = useDataStore();
    const { clearColor, removeAll, loadData, setCanvasSvgDimension, drawAll } =
      dataStore;
    const getStoryLine = () => {
      clearColor();
      removeAll();
      loadData().then(() => {
        setCanvasSvgDimension().then(() => {
          drawAll();
        });
      });
    };

    const getStyle = (i: number, v: number) => {
      if (dataStore.tableHeaders[i].banned) {
        return {
          opacity: 1,
          "background-color": "#ccc",
        };
      } else {
        return {
          opacity: v / dataStore.maxCountLocation,
        };
      }
    };

    const setSortByLocal = (i: number) => {
      dataStore.setSortBy(i);
    };

    const setBannedLocal = (i: number, event: MouseEvent) => {
      event.preventDefault();
      dataStore.setBanned(i);
    };

    return {
      getStyle,
      setBannedLocal,
      dataStore,
      getStoryLine,
      setSortByLocal,
    };
  },
};
</script>

<template>
  <div class="rows-chart">
    <div class="chart-header">
      <div class="name">ID</div>
      <div class="grid-chart">
        <div
          v-for="(header, i) in dataStore.tableHeaders"
          :key="i"
          @click.left="setSortByLocal(i)"
          @click.right="setBannedLocal(i, $event)"
          :class="['grid', 'in-header', { selected: header.selected }]"
          :style="{
            height: `20px`,
            'background-color': header.banned ? `#ccc` : `#fff`,
            border: `1px solid ${header.banned ? `#888` : `#ccc`}`,
          }"
        >
          {{ header.text }}
        </div>
      </div>
      <!-- <div class="sum">sum / #w</div> -->
    </div>
    <div class="chart-content">
      <transition-group name="flip-list">
        <div
          v-for="row in dataStore.locationInfos"
          :key="row.rid"
          :id="`${row.rid}`"
          class="row"
        >
          <div class="name">{{ row.rid }}</div>
          <div class="grid-chart">
            <div
              class="grid"
              v-for="(v, i) in row.distribution"
              :key="i"
              :style="getStyle(i, v)"
            ></div>
          </div>
        </div>
      </transition-group>
    </div>
    <div class="btn-wrapper">
      <div class="btn" @click="getStoryLine">POST</div>
    </div>
  </div>
</template>

<style lang="scss">
.rows-chart {
  position: relative;
  width: 100%;
  height: 390px;
  background-color: #fff;
  padding: 5px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

  // .chart-menu {
  //   position: relative;
  //   width: 100%;
  //   height: 24px;
  // }

  .chart-header {
    position: relative;
    width: 100%;
    height: 30px;
    display: flex;
    border-bottom: 1px solid #ccc;
  }

  .chart-content {
    position: relative;
    width: 100%;
    height: calc(100% - 60px);
    overflow-y: scroll;
  }

  .row {
    position: relative;
    height: 20px;
    width: 100%;
    display: flex;
    transition: all 0.3s;
  }

  .name {
    position: relative;
    flex: 0 0 50px;
    line-height: 20px;
    font-size: 14px;
    text-align: center;
  }

  .grid-chart {
    position: relative;
    flex: 1;
    display: flex;
    // transform: scaleY(-1);

    .grid {
      flex: 1;
      background-color: #47b5ff;
      height: calc(100% - 4px);
      top: 2px;
      margin: 0 2px;
      border-radius: 2px;
      font-size: 12px;
      line-height: 18px;
      text-align: center;
    }

    .in-header {
      background-color: #fff;
      font-size: 14px !important;
      // box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
      // rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
      transition: color 300ms;
    }

    .selected {
      color: #47b5ff !important;
    }
  }

  .sum {
    flex: 0 0 100px;
    position: relative;
    margin-left: 10px;

    .wrapper {
      position: relative;
      height: calc(100% - 2px);
      width: calc(100% - 4px);
      // border: 1px solid #ccc;
      border-radius: 2px;
      margin: 1px 2px;
      overflow: hidden;

      .hint {
        position: relative;
        height: 100%;
        left: 0px;
        top: 0px;
        background-color: #47b5ff;
        color: #fff;
        padding: 2px;
        line-height: 14px;
        text-align: left;
        overflow: hidden;
        font-size: 12px;
        white-space: nowrap;
      }

      .background {
        position: absolute;
        height: 100%;
        width: 100%;
        left: 0px;
        top: 0px;
        border: 1px solid #47b5ff;
        color: #47b5ff;
        font-size: 12px;
        line-height: 16px;
        text-align: left;
        padding-left: 2px;
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

*::-webkit-scrollbar,
*::-webkit-scrollbar-thumb {
  width: 0px;
  height: 26px;
  border-radius: 13px;
  background-clip: padding-box;
  border: 10px solid transparent;
}

*::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 0 10px;
}

// .fade-move,
// .fade-enter-active,
// .fade-leave-active {
//   transition: all 0.3s;
// }
// .fade-enter-from,
// .fade-leave-to {
//   opacity: 0;
//   transform: translateY(30px);
// }
// .fade-leave-active {
//   position: absolute;
// }

.flip-list-move {
  transition: all 0.3s;
}
</style>
