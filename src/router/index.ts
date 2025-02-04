import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "../views/TabsPage.vue";
import SiteDetailsPage from "@/views/SiteDetailsPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/tabs/home",
  },
  {
    path: "/tabs/",
    component: TabsPage,
    children: [
      {
        path: "",
        redirect: "/tabs/home",
      },
      {
        path: "home",
        component: () => import("@/views/MainPage.vue"),
      },
      {
        path: "/details:id",
        name: "SiteDetailsView",
        props: true,
        component: SiteDetailsPage,
      },
      {
        name: "SiteListView",
        path: "sitesList",
        component: () => import("@/views/SitesListPage.vue"),
      },
      {
        path: "addSite",
        name: "AddNewSite",
        component: () => import("@/views/AddNewSite.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
