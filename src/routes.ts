import { createRouter, createWebHistory } from "vue-router";

import HomePage from "./pages/HomePage.vue";
import LoginPage from "./pages/LoginPage.vue";
import SignupPage from "./pages/SignupPage.vue";
import CheckStatusPage from "./pages/CheckStatusPage.vue";
import AccountPage from "./pages/staff/AccountPage.vue";
import ReservationPage from "./pages/ReservationPage.vue";

const routes = [
  { path: "/", component: HomePage,name:"home" },
  { path: "/login", component: LoginPage, name: "login" },
  { path: "/signup", component: SignupPage, name: "signup" },
  {
    path: "/check_reservation",
    component: CheckStatusPage,
    name: "check_reservation",
  },
  { path: "/staff/account", component: AccountPage, name: "staff_account" },
  { path: "/reservation", component: ReservationPage, name: "reservation" },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
