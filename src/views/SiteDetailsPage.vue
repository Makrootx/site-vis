<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <ion-title>Site Details</ion-title>
          <IonButton
            style="
              margin-right: 1em;
              --background: var(--ion-color-danger);
              padding: 1px;
            "
            @click="onDeleteClick"
          >
            <IonIcon slot="icon-only" :icon="trashBin" />
          </IonButton>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Site Details</ion-title>
        </ion-toolbar>
      </ion-header>
      <div style="padding: 1em">
        <div class="img-container">
          <img :src="imagePreview ?? 'stockPhoto.png'" />
        </div>

        <div class="metadata-badge" style="padding: 8px 10px">
          <div class="flex-hor-between metadata-headers">
            <div>Location:</div>
            <div>Date:</div>
          </div>
          <div class="flex-hor-between">
            <div class="flex-ver">
              <div>{{ site?.location?.split(" ")[0] }}</div>
              <div>{{ site?.location?.split(" ")[1] }}</div>
            </div>
            <div>{{ site?.date ?? "Unknown" }}</div>
          </div>
        </div>
        <br />
        <div class="car-header">
          {{ site?.header }}
        </div>
        <div class="car-content">{{ site?.content }}</div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { Site } from "@/models/site";
import { DBSERVICE, DbService } from "@/providers/database-service";
import { SiteService } from "@/providers/site-service";
import { Capacitor } from "@capacitor/core";
import { Filesystem } from "@capacitor/filesystem";
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter,
  IonButton,
} from "@ionic/vue";
import { trashBin } from "ionicons/icons";
import { inject, Ref, ref } from "vue";
import { useRouter } from "vue-router";

const site = ref<Site | undefined>();
const dbService: Ref<DbService> | undefined = inject(DBSERVICE);
const imagePreview = ref<string>();

const props = defineProps<{ id: string }>();
const router = useRouter();

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

onIonViewDidEnter(async () => {
  if (dbService) {
    const siteService = new SiteService(dbService.value);
    site.value = await siteService.getSiteById(Number.parseInt(props.id));
    imagePreview.value = site.value?.filePath
      ? await getImage(site.value?.filePath)
      : "stockPhoto.png";
  }
});

const deleteFile = async (filePath: string) => {
  if (dbService?.value) {
    const siteService = new SiteService(dbService?.value);
    if (await siteService.checkFileUsage(filePath)) return;
  }
  if (Capacitor.isNativePlatform()) {
    try {
      await Filesystem.deleteFile({
        path: filePath,
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    localStorage.removeItem(filePath);
  }
};

const onDeleteClick = async () => {
  if (dbService) {
    const siteService = new SiteService(dbService.value);
    if (site.value) {
      site.value.filePath ? await deleteFile(site.value?.filePath) : "";
      await siteService.deleteSiteById(site.value?.id);
    }
    router.push({ path: "/tabs" });
  }
};
</script>

<style lang="css" scoped>
.img-container {
  background-color: var(--ion-background-color-step-100);
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.car-header {
  font-size: xx-large;
  color: var(--ion-foreground-color-step-100);
  margin-bottom: 20px;
}

.car-content {
  font-size: medium;
}

.metadata-badge {
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  background: var(--ion-background-color-step-100);
}

.flex-hor-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-ver {
  display: flex;
  flex-direction: column;
}

.metadata-headers {
  font-weight: bold;
}
</style>
