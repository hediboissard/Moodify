import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from '../views/RegisterPage.vue'

const routes = [
  { path: "/", name: "Login", component: LoginPage },
  { path: "/about", name: "About", component: About },
  { path: "/home", name: "Home", component: Home },
  { path: "/register", name: "Register", component: RegisterPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
