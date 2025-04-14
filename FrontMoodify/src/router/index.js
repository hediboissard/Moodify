import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import ProfilPage from "../views/ProfilPage.vue";

const routes = [
  { path: "/", name: "Login", component: LoginPage },
  { path: "/about", name: "About", component: About },
  { path: "/home", name: "Home", component: Home },
  { path: "/register", name: "Register", component: RegisterPage },
  { path: "/profil", name: "Profil", component: ProfilPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
