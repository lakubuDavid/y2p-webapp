import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./routes";
import VCalendar from "v-calendar";
import "v-calendar/style.css";

// Use plugin with optional defaults
createApp(App).use(VCalendar, {}).use(router).mount("#app");
