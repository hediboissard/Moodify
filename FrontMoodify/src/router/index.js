// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import FriendsPage from "../views/FriendsPage.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import ProfilPage from "../views/ProfilPage.vue";
import MoodTest from "../components/MoodTest.vue";

const routes = [
  { path: "/", name: "Login", component: LoginPage },
  { path: "/register", name: "Register", component: RegisterPage },
  { path: "/home", name: "Home", component: HomePage, meta: { requiresAuth: true } },
  { path: "/friends", name: "Friends", component: FriendsPage, meta: { requiresAuth: true } },
  { path: "/profil", name: "Profil", component: ProfilPage, meta: { requiresAuth: true } },
  { path: "/moodTest", name: "Moodtest", component: MoodTest },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔐 Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router;
