# Moodify 🎧

Moodify est une application web fullstack construite avec **Vue.js (Vite)** pour le frontend et **Node.js (Express)** pour le backend.

---

## 🚀 Initialisation du projet

### 1. Cloner le projet


git clone <url-du-repo>
cd moodify


---

### 2. Installer les dépendances


cd BackendMoodify
npm install

cd ../FrontendMoodify
npm install


---

### 3. Configurer les fichier `.env`

#### 📦 Backend (`backend/.env`)
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=motdepasse
```

#### 🎨 Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3000
```

---

### 4. Lancer les serveurs

#### 🌐 Backend

cd BackendMoodify
node src/index.js


#### 🖼️ Frontend

cd ../FrontendMoodify
npm run dev


---

## ✅ Prérequis

- Node.js ≥ 18
- NPM ≥ 9
- MySQL (si utilisé)
