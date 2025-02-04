<template>
  <IonCard class="card" @click="onClick" color="primary">
    <img :src="img" class="card-image" />
    <IonCardHeader class="">
      <IonCardTitle class="card-header">{{ header }} </IonCardTitle>
      <IonCardSubtitle class="card-sub">{{ date }}</IonCardSubtitle>
    </IonCardHeader>
    <IonCardContent class="card-content">
      <slot></slot>
    </IonCardContent>
    <div class="boxer"></div>
  </IonCard>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/vue";

const emits = defineEmits<{
  click: [];
}>();

const onClick = () => {
  emits("click");
  console.log("loh");
};

withDefaults(
  defineProps<{
    header?: string;
    date?: string;
    img?: string;
  }>(),
  {
    header: "",
    date: "Unknown",
    img: "stockPhoto.jpg",
  }
);
</script>

<style scoped>
.card {
  transition: transform 0.2s ease-in;
}

@media (hover: hover) {
  .card:hover {
    transform: scale(1.05);
  }
}

.card:active {
  transform: scale(1.05) !important;
}

.card-content {
  font-size: 10px;
  /* max-height: 4.5em; */
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5em;
  padding-bottom: 2px;
}

.boxer {
  height: 10px;
}

.card-image {
  display: flex;
  margin: auto;
  /* padding: 10px; */
}

.card-sub {
  font-size: smaller;
}

.card-header {
  /* padding-top: 2px; */
  font-size: large;
}
</style>
