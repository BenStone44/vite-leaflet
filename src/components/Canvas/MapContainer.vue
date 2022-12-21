<script lang="ts">
import { onMounted, reactive, ref } from "vue";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "element-plus/lib/components/button/style/css";
import { map_param } from "@/constants";
const { url, params } = map_param;

export default {
  // props: {
  //   id: {
  //     required: true,
  //     type: String,
  //   },
  //   coord: {
  //     required: true,
  //     type: Object,
  //   },
  // },
  setup(props) {
    onMounted(() => {
      //  url: "https://api.mapbox.com/styles/v1/zikunrain/cl09ejle0003v14mglm1p9x13/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiemlrdW5yYWluIiwiYSI6ImNqeWE2dXJ1djBibmIzY21mMWl5MDljc2wifQ.NMe8T_yYFKIsraDJV4tIPw"
      const mp = L.map("map", params as L.MapOptions);
      L.tileLayer(url).addTo(mp);
    });

    return {};
  },
};
</script>

<template>
  <div class="map" id="map"></div>
</template>

<style lang="scss">
.map {
  position: inherit;
  width: 100%;
  height: 100%;
}
</style>
