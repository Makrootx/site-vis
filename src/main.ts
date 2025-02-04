import { createApp, ref } from "vue";
import App from "./App.vue";
import router from "./router";

import { IonicVue } from "@ionic/vue";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import "@ionic/vue/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

import { JeepSqlite } from "jeep-sqlite/dist/components/jeep-sqlite";
import { DBSERVICE, DbService } from "./providers/database-service";

import { defineCustomElements } from "@ionic/pwa-elements/loader";
import { SiteService } from "./providers/site-service";

defineCustomElements(window);

customElements.define("jeep-sqlite", JeepSqlite);

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const dbService = ref(new DbService());
    await dbService.value.initWebStore();

    const app = createApp(App).use(IonicVue).use(router);

    app.provide([DBSERVICE], dbService);

    const carService = new SiteService(dbService.value as DbService);
    await carService.createTableIfNotExist();

    router.isReady().then(() => {
      app.mount("#app");
    });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});
