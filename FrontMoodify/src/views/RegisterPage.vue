<template>
  <div class="auth-screen">
    <div class="bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>

    <div class="auth-card">
      <div class="brand">
        <svg class="brand-logo" width="40" height="40" viewBox="0 0 101 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.597 22.5969C18.6918 18.6916 12.2582 18.6514 9.20664 23.2546C7.09989 26.4327 5.35752 29.8504 4.02019 33.4445C1.51609 40.1742 0.490881 47.3644 1.0143 54.5259C1.53773 61.6873 3.5975 68.652 7.05351 74.9462C10.5095 81.2403 15.2807 86.7163 21.0424 91.0014C26.8041 95.2866 33.4212 98.2806 40.4436 99.7795C47.4659 101.279 54.7288 101.247 61.738 99.6882C68.7472 98.1291 75.3384 95.0785 81.0632 90.7441C84.1205 88.4292 86.8924 85.7772 89.3299 82.8452C92.8606 78.5983 90.971 72.4483 86.1073 69.8317C81.2436 67.2152 75.2601 69.2163 71.1962 72.9561C70.4922 73.604 69.7562 74.2191 68.9904 74.7989C65.5556 77.3996 61.6009 79.2299 57.3953 80.1654C53.1898 81.1009 48.8321 81.1196 44.6187 80.2202C40.4052 79.3208 36.435 77.5244 32.9779 74.9533C29.5209 72.3822 26.6582 69.0966 24.5846 65.3202C22.511 61.5437 21.2751 57.3648 20.9611 53.068C20.647 48.7711 21.2622 44.457 22.7646 40.4191C23.0996 39.5189 23.4769 38.6371 23.8948 37.7765C26.3073 32.8084 26.5023 26.5021 22.597 22.5969Z" fill="#9EC5AB"/>
          <path d="M79.1656 79.1654C83.0708 83.0706 89.5044 83.1109 92.5559 78.5076C94.6627 75.3296 96.4051 71.9119 97.7424 68.3178C100.246 61.588 101.272 54.3979 100.748 47.2364C100.225 40.075 98.1651 33.1103 94.7091 26.8161C91.2531 20.5219 86.4819 15.046 80.7202 10.7608C74.9585 6.47562 68.3414 3.4817 61.319 1.98272C54.2967 0.483753 47.0338 0.514896 40.0246 2.07404C33.0154 3.63318 26.4242 6.68374 20.6994 11.0182C17.6421 13.333 14.8702 15.985 12.4326 18.9171C8.90198 23.164 10.7915 29.314 15.6552 31.9305C20.5189 34.547 26.5025 32.546 30.5664 28.8061C31.2704 28.1583 32.0064 27.5432 32.7722 26.9634C36.207 24.3627 40.1617 22.5324 44.3673 21.5969C48.5728 20.6614 52.9305 20.6427 57.1439 21.5421C61.3573 22.4415 65.3276 24.2378 68.7846 26.8089C72.2417 29.3801 75.1044 32.6656 77.178 36.4421C79.2516 40.2186 80.4874 44.3974 80.8015 48.6943C81.1155 52.9912 80.5004 57.3053 78.9979 61.3431C78.663 62.2434 78.2856 63.1252 77.8677 63.9858C75.4552 68.9539 75.2603 75.2602 79.1656 79.1654Z" fill="#32746D"/>
        </svg>
        <h1 id="moodify">Moodify</h1>
      </div>

      <p class="tagline">Créez votre compte</p>

      <div class="form-group">
        <label>Nom d'utilisateur</label>
        <input v-model="username" type="text" placeholder="Votre pseudo" autocomplete="username" />
      </div>
      <div class="form-group">
        <label>E-mail</label>
        <input v-model="email" type="email" placeholder="vous@exemple.com" autocomplete="email" />
      </div>
      <div class="form-group">
        <label>Mot de passe</label>
        <input v-model="password" type="password" placeholder="8 caractères minimum" autocomplete="new-password" />
      </div>
      <div class="form-group">
        <label>Confirmer le mot de passe</label>
        <input v-model="confirmPassword" type="password" placeholder="Répétez votre mot de passe" autocomplete="new-password" />
      </div>

      <button @click="handleRegister" class="btn-primary">Créer le compte</button>

      <p class="footer-link">
        Déjà un compte ?
        <button @click="goToLogin">Se connecter</button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/services/authService'

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function goToLogin() {
  router.push('/')
}

const handleRegister = async () => {
  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    alert("Tous les champs sont requis.")
    return
  }
  if (!emailRegex.test(email.value)) {
    alert("Format d'email invalide.")
    return
  }
  if (password.value.length < 8) {
    alert("Le mot de passe doit contenir au moins 8 caractères.")
    return
  }
  if (password.value !== confirmPassword.value) {
    alert("Les mots de passe ne correspondent pas.")
    return
  }
  try {
    await register({ username: username.value, email: email.value, password: password.value })
    alert("✅ Inscription réussie ! Vous pouvez vous connecter.")
    router.push('/')
  } catch (err) {
    alert("❌ Erreur : " + (err.response?.data?.message || err.message))
  }
}
</script>

<style scoped>
.auth-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at 60% 70%, #01200F 0%, #011502 70%);
  overflow: hidden;
  position: relative;
}

.bg-orbs { position: absolute; inset: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.2; }
.orb-1 { width: 450px; height: 450px; background: #32746D; bottom: -80px; left: -80px; }
.orb-2 { width: 350px; height: 350px; background: #104F55; top: -60px; right: -60px; }

.auth-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: rgba(1, 32, 15, 0.7);
  border: 1px solid rgba(158, 197, 171, 0.15);
  border-radius: 20px;
  padding: 2.5rem;
  backdrop-filter: blur(20px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
}

.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 0.4rem;
}
.brand-logo { animation: spin 8s linear infinite; }
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.brand h1 { font-size: 2rem; margin: 0; }

.tagline {
  text-align: center;
  color: rgba(158, 197, 171, 0.6);
  font-size: 0.85rem;
  margin: 0 0 1.8rem;
  letter-spacing: 0.03em;
}

.form-group { margin-bottom: 1rem; }
.form-group label {
  display: block;
  font-size: 0.78rem;
  color: #9EC5AB;
  margin-bottom: 6px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.form-group input {
  width: 100%;
  padding: 0.7rem 1rem;
  background: rgba(1, 32, 15, 0.8);
  border: 1px solid rgba(158, 197, 171, 0.2);
  border-radius: 10px;
  color: #F0F7F2;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-group input::placeholder { color: rgba(158, 197, 171, 0.3); }
.form-group input:focus {
  border-color: #32746D;
  box-shadow: 0 0 0 3px rgba(50, 116, 109, 0.15);
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  background: #104F55;
  color: #9EC5AB;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  letter-spacing: 0.02em;
}
.btn-primary:hover {
  background: #32746D;
  color: #F0F7F2;
  transform: translateY(-1px);
}

.footer-link {
  text-align: center;
  margin-top: 1.4rem;
  font-size: 0.85rem;
  color: rgba(158, 197, 171, 0.5);
}
.footer-link button {
  background: none;
  border: none;
  color: #9EC5AB;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
  font-size: 0.85rem;
  padding: 0 0 0 4px;
  transition: color 0.2s;
}
.footer-link button:hover { color: #F0F7F2; }
</style>
