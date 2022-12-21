import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

import "./assets/main.css";
import ElementUI, { ElMenuItem } from "element-plus";

import { ElButton, ElSelect, ElTable, ElIcon } from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);

app.use(createPinia());
app.use(ElementUI);
app.use(ElButton);
app.use(ElSelect);
app.use(ElTable);
app.use(ElIcon);
app.use(ElMenuItem);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app");
