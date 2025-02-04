<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Home</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="main-container">
        <div style="display: flex; align-items: center; flex-direction: column">
          <div class="image-container">
            <ion-img src="appIcon.svg" />
          </div>
        </div>
        <IonButton class="nav-button" @click="capturePhoto"
          >Add new site</IonButton
        >
        <IonButton class="nav-button" @click="onViewSitesClick"
          >View visited sites</IonButton
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
  IonImg,
  IonButton,
} from "@ionic/vue";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { ref } from "vue";
import { Geolocation } from "@capacitor/geolocation";
import { useRouter } from "vue-router";
import { instanceToPlain } from "class-transformer";

interface Metadata {
  time: string;
  location: string;
}

interface PhotoMeta {
  photoSrc: string;
  meta: Metadata;
}

const router = useRouter();

const photo = ref<string | undefined>(undefined);
const photoMetadata = ref<Metadata | null>(null);

const capturePhoto = async (): Promise<void> => {
  try {
    const photoData = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      quality: 90,
    });

    photo.value = photoData.webPath ?? undefined;
    if (photo.value) {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log(coordinates);
      const metaData: Metadata = {
        time: photoData.exif?.DateTime
          ? getDateString(photoData.exif.DateTime)
          : "",
        location:
          coordinates.coords.longitude + " " + coordinates.coords.latitude,
      };
      photoMetadata.value = metaData;
      const photoMeta: PhotoMeta = {
        photoSrc: photo.value,
        meta: metaData,
      };
      router.push({
        name: "AddNewSite",
        state: { data: instanceToPlain(photoMeta) },
      });
    }
  } catch (error) {
    console.error("Error capturing photo:", error);
  }
};

const getDateString = (metaDate: string): string => {
  const dateComp = metaDate.split(" ");
  const timeComp = dateComp[1].split(":");
  return (
    dateComp[0].replaceAll(":", "/") + " " + timeComp[0] + ":" + timeComp[1]
  );
};

const onViewSitesClick = () => {
  router.push({
    name: "SiteListView",
  });
};
</script>

<style lang="css" scoped>
.main-container {
  padding: 1em;
  display: flex;
  flex-direction: column;
}

.image-container {
  width: 50%;
  height: 50%;
  margin-bottom: 30px;
}

.nav-button {
  margin-bottom: 15px;
}
</style>
