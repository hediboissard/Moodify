// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import FriendsPage from "../views/FriendsPage.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import ProfilPage from "../views/ProfilPage.vue";
import FriendLikesPage from '../views/FriendLikesPage.vue';

const routes = [
  { path: "/", name: "Login", component: LoginPage },
  { path: "/register", name: "Register", component: RegisterPage },
  { path: "/home", name: "Home", component: HomePage, meta: { requiresAuth: true } },
  { path: "/friends", name: "FriendsPage", component: FriendsPage, meta: { requiresAuth: true } },
  { path: "/profil", name: "Profil", component: ProfilPage, meta: { requiresAuth: true } },
  {
    path: '/friends/:id/likes',
    name: 'FriendLikes',
    component: FriendLikesPage,
    props: true,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔐 Navigation Guard
router.beforeEach((to, from, next) => {
  const hasToken = !!localStorage.getItem('token')
  const hasSpotifyId = !!localStorage.getItem('spotify_id')
  const isAuthenticated = hasToken || hasSpotifyId

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router;
