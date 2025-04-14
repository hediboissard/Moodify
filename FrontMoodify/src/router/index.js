import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import LoginPage from "../views/LoginPage.vue";

const routes = [
  { path: "/", name: "Login", component: LoginPage },
  { path: "/about", name: "About", component: About },
  { path: "/home", name: "Home", component: Home }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
