import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import FriendsPage from "../views/FriendsPage.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from '../views/RegisterPage.vue';
import ProfilPage from '../views/ProfilPage.vue';

const routes = [
  { path: "/", name: "Login", component: LoginPage },
  { path: "/home", name: "Home", component: HomePage },
  { path: "/friends", name: "Friends", component: FriendsPage },
  { path: "/register", name: "Register", component: RegisterPage },
  { path: "/profil", name: "Profil", component: ProfilPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
