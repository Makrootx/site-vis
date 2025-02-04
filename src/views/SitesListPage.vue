<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Sites List</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Sites List</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="card-container">
        <CardComponent
          v-for="(item, index) in sites"
          :key="item.id"
          :header="item.header"
          :date="item.date ?? 'Unknown'"
          :img="loadImages ? loadImages[index] ?? undefined : undefined"
          @click="onClick(item.id)"
          >{{ item.content }}</CardComponent
        >
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  onIonViewDidEnter,
} from "@ionic/vue";

import CardComponent from "@/components/CardComponent.vue";
import { useRouter } from "vue-router";
import { inject, Ref, ref } from "vue";
import { Site } from "@/models/site";
import { SiteService } from "@/providers/site-service";
import { Capacitor } from "@capacitor/core";
import { Filesystem } from "@capacitor/filesystem";
import { DBSERVICE, DbService } from "@/providers/database-service";

const router = useRouter();

const loadImages = ref<(string | null | undefined)[]>();
const onClick = (id: number) => {
  router.push({
    name: "SiteDetailsView",
    params: {
      id,
    },
  });
};

const sites = ref<Site[]>([]);

const loadCars = async () => {
  if (dbService) {
    const siteService = new SiteService(dbService.value);
    await siteService.createTableIfNotExist();
    const res = await siteService.getAllSites();
    if (res) sites.value = res;
    console.log(res);
  }
};

const getImage = (filePath: string) => {
  if (Capacitor.isNativePlatform()) {
    return Filesystem.readFile({
      path: filePath,
    }).then((result) => {
      console.log(result.data.toString());
      return "data:image/png;base64," + result.data.toString();
    });
  } else {
    const file = localStorage.getItem(filePath);
    return `${file}`;
  }
};

const dbService: Ref<DbService> | undefined = inject(DBSERVICE);
onIonViewDidEnter(async () => {
  await loadCars();
  const proms = sites.value.map((val) =>
    val.filePath ? getImage(val.filePath) : undefined
  );
  loadImages.value = await Promise.all(proms);
});
</script>

<style lang="css" scoped>
.card-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
}
</style>
