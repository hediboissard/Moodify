import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Friends from "../views/Friends.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from '../views/RegisterPage.vue'
import ProfilPage from '../views/ProfilPage.vue'

const routes = [
  { path: "/", name: "Login", component: LoginPage },
  { path: "/home", name: "Home", component: Home },
  { path: "/friends", name: "Friends", component: Friends },
  { path: "/register", name: "Register", component: RegisterPage },
  { path: "/profil", name: "Profil", component: ProfilPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
