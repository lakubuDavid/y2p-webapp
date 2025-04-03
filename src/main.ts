import { createApp } from "vue";
import "./style.css";
import "./primitives.css";
import App from "./App.vue";
import { router } from "./routes";
// import VCalendar from "v-calendar";
// import "v-calendar/style.css";
// import Vue3Toastify, { toast, type ToastContainerOptions } from "vue3-toastify";
// import "vue3-toastify/dist/index.css";
import PrimeVue from "primevue/config";
import ToastService from 'primevue/toastservice';
import "primeicons/primeicons.css";
import Aura from "@primeuix/themes/aura";
import { definePreset } from "@primeuix/themes";

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {faCat,faDog,faKiwiBird} from '@fortawesome/free-solid-svg-icons'
import { createPinia } from "pinia";

/* add icons to the library */
library.add([faCat,faDog,faKiwiBird])

const Theme = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{zinc.50}",
      100: "{zinc.100}",
      200: "{zinc.200}",
      300: "{zinc.300}",
      400: "{zinc.400}",
      500: "{zinc.500}",
      600: "{zinc.600}",
      700: "{zinc.700}",
      800: "{zinc.800}",
      900: "{zinc.900}",
      950: "{zinc.950}",
    },
    colorScheme: {
      light: {
        primary: {
          color: "{zinc.950}",
          inverseColor: "#ffffff",
          hoverColor: "{zinc.900}",
          activeColor: "{zinc.800}",
        },
        highlight: {
          background: "{zinc.950}",
          focusBackground: "{zinc.700}",
          color: "#ffffff",
          focusColor: "#ffffff",
        },
      },
      dark: {
        primary: {
          color: "{zinc.50}",
          inverseColor: "{zinc.950}",
          hoverColor: "{zinc.100}",
          activeColor: "{zinc.200}",
        },
        highlight: {
          background: "rgba(250, 250, 250, .16)",
          focusBackground: "rgba(250, 250, 250, .24)",
          color: "rgba(255,255,255,.87)",
          focusColor: "rgba(255,255,255,.87)",
        },
      },
    },
  },
});

// Use plugin with optional defaults
createApp(App)
.component('FaIcon', FontAwesomeIcon)
  // .use(Vue3Toastify, {
  //   autoClose: 3000,
  //   position: toast.POSITION.BOTTOM_RIGHT,
  // } as ToastContainerOptions)
  .use(createPinia())
  .use(PrimeVue, {
    theme: {
      preset: Theme,
      options: {
        darkModeSelector: false || "none",
      },
    },
  })
  .use(ToastService)
  .use(router)
  .mount("#app");
