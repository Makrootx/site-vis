<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Add Site</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Add Site</ion-title>
        </ion-toolbar>
      </ion-header>
      <div style="padding: 1em">
        <div class="img-add-container">
          <img :src="photoSrc" class="img-site" />
        </div>
        <InputField v-model="site.header">Header</InputField>
        <br />
        <div style="font-size: larger; margin-bottom: 10px; font-weight: bold">
          Content
        </div>
        <IonItem class="content-box">
          <IonTextarea
            class="content-text"
            v-model="site.content"
          ></IonTextarea>
        </IonItem>
        <div class="hor-flex">
          <IonButton @click="onSaveClick">Save</IonButton>
          <IonButton
            @click="onCancelClick"
            style="--background: var(--ion-color-warning-shade)"
            >Cancel</IonButton
          >
        </div>
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
  IonButton,
  IonTextarea,
  IonItem,
} from "@ionic/vue";
import { inject, Ref, ref } from "vue";
import InputField from "@/components/InputField.vue";
import { SiteCreateDto } from "@/models/site";
import { saveImage } from "@/functions/saveFunc";
import { DBSERVICE, DbService } from "@/providers/database-service";
import { SiteService } from "@/providers/site-service";
import { useRouter } from "vue-router";

const dbService: Ref<DbService> | undefined = inject(DBSERVICE);
const router = useRouter();

const initialSite: SiteCreateDto = {
  content: "",
  header: "",
};
const site = ref<SiteCreateDto>(initialSite);

const photoSrc = ref<string | undefined>(undefined);
// const props = defineProps<{ url?: string }>();

const onSaveClick = async () => {
  if (photoSrc.value) {
    const filePath = await saveImage(photoSrc.value);
    site.value.filePath = filePath;
  }
  if (dbService) {
    const siteService = new SiteService(dbService.value);
    siteService.addSite(site.value);
    router.push({ path: "/tabs" });
  }
};

const onCancelClick = () => {
  router.push({ path: "/tabs" });
};

onIonViewDidEnter(async () => {
  site.value = { ...site.value, header: "", content: "" };
  const state = history.state;
  photoSrc.value = state?.data?.photoSrc;
  site.value.date = state?.data?.meta.time;
  site.value.location = state?.data?.meta.location;
});
</script>

<style lang="css" scoped>
.hor-flex {
  display: flex;
  justify-content: space-between;
}
.content-box {
  border-radius: 10px;
  margin-bottom: 20px;
  --background: var(--ion-background-color-step-100);
}
.content-text {
  overflow-y: hidden;
  display: flex;
  min-height: 200px;
  padding: 5px 0px;
}
.img-add-container {
  background-color: var(--ion-background-color-step-100);
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  min-height: 200px;
}

/* .img-add-container:active {
  background-color: #333;
  transform: scale(0.98);
} */

.img-site {
  border-radius: 10px;
}
</style>
