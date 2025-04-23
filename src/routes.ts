import { createRouter, createWebHistory } from "vue-router";

import HomePage from "./pages/HomePage.vue";
import LoginPage from "./pages/LoginPage.vue";
import SignupPage from "./pages/SignupPage.vue";
import CheckStatusPage from "./pages/CheckStatusPage.vue";
import AccountPage from "./pages/staff/AccountPage.vue";
import DeniedPage from "@pages/denied.vue"
// import ReservationPage from "./pages/ReservationPage.vue";

import ListReservationsPage from "./pages/staff/ListReservationsPage.vue";
import ListPetsRecordsPage from "./pages/staff/ListPetsRecordsPage.vue";
import { useUserStore } from "@stores/user";

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: HomePage, name: "home" },
  { path: "/login", component: LoginPage, name: "login" },
  { path: "/signup", component: SignupPage, name: "signup" },
  {
    path: "/check_reservation",
    component: CheckStatusPage,
    name: "check_reservation",
  },
  { path: "/staff/account", component: AccountPage, name: "staff_account" },
  { path: "/staff/pets", component: ListPetsRecordsPage, name: "staff_pets" },
  {
    path: "/staff/reservations",
    component: ListReservationsPage,
    name: "reservation",
  },
  {
    component:DeniedPage,
    path:"/unauthorized",
    name:"denied"
  },
  // {
  //   path: "/staff/reservations/new",
  //   component: ReservationPage,
  //   name: "new_reservation",
  // },
  // { path: "/staff/:pathMatch(.*)*", redirect: "/staff/account" },
  { path: "/:path(.*)*", redirect: "/" },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

const protectedRoutes = ["/staff"];

router.beforeEach((to) => {
const userStore = useUserStore()
  if (
    protectedRoutes.some((protectedRoute) => {
      return to.path.startsWith(protectedRoute);
    })
  ) {
    if(!userStore.currentUser || userStore.currentUser.type !== "staff"){
      return {name:"denied"}
    }
  }
});
