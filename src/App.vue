<script setup lang="ts">
import MapContainer from "./components/Canvas/MapContainer.vue";
import ConfigMenu from "./components/Configurator/ConfigMenu.vue";
</script>

<template>
  <div class="system">
    <ConfigMenu />
    <div class="system-content">
      <MapContainer />
    </div>
  </div>
</template>

<style lang="scss">
body {
  background-color: #fff !important;
}
.system {
  position: relative;
  height: 100%;
  width: 100%;
  color: #4d5156;
  .system-content {
    position: relative;
    width: calc(100% - 50px);
    height: 100%;
    float: left;
  }
}
</style>
