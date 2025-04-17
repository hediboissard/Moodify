
# Moodify 🎧

Moodify est une application web fullstack qui génère des playlists Spotify en fonction de votre humeur. Elle est construite avec **Vue.js (Vite)** pour le frontend et **Node.js (Express)** pour le backend.

---

## 🚀 Installation et Configuration

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd Moodify
```

---

### 2. Installer les dépendances

#### Backend
```bash
cd BackMoodify
npm install
```

#### Frontend
```bash
cd ../FrontMoodify
npm install
```

---

### 3. Configurer les fichiers `.env`

#### 📦 Backend (`BackMoodify/.env`)
Créez un fichier `.env` dans le dossier `BackMoodify` avec les variables suivantes :

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=motdepasse
DB_NAME=moodify
SPOTIFY_CLIENT_ID=<votre_client_id_spotify>
SPOTIFY_CLIENT_SECRET=<votre_client_secret_spotify>
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/spotify/callback
JWT_SECRET=moodifysupersecret
```

#### 🎨 Frontend (`FrontMoodify/.env`)
Créez un fichier `.env` dans le dossier FrontMoodify avec les variables suivantes :

```env
VITE_API_URL=http://localhost:3000
```

---

### 4. Configurer la base de données

#### Étape 1 : Lancer MySQL
Assurez-vous que MySQL est en cours d'exécution sur votre machine.

#### Étape 2 : Créer la base de données
Exécutez le script SQL fourni dans script.sql pour créer la base de données et les tables nécessaires.

```bash
mysql -u root -p < BackMoodify/src/script.sql
```

---

### 5. Lancer les serveurs

#### 🌐 Backend
Dans le dossier BackMoodify, lancez le serveur backend :

```bash
cd BackMoodify
node src/index.js
```

#### 🖼️ Frontend
Dans le dossier FrontMoodify, lancez le serveur frontend :

```bash
cd ../FrontMoodify
npm run dev
```

Le frontend sera accessible à l'adresse : [http://localhost:5173](http://localhost:5173)

---

## 📚 Fonctionnalités

### 1. **Connexion avec Spotify**
- Authentifiez-vous avec votre compte Spotify.
- Synchronisez vos informations Spotify avec l'application.

### 2. **Mood Slider**
- Ajustez votre humeur à l'aide d'un slider.
- Générez des playlists Spotify adaptées à votre humeur.

### 3. **Titres Likés**
- Likez vos morceaux préférés et retrouvez-les dans la barre latérale.
- Supprimez des morceaux likés.

### 4. **Gestion des Amis**
- Ajoutez ou supprimez des amis.
- Consultez l'humeur et le morceau actuel de vos amis.

### 5. **Création de Playlists**
- Ajoutez des morceaux à vos playlists Spotify existantes.
- Créez de nouvelles playlists directement depuis l'application.

### 6. **Profil Utilisateur**
- Modifiez votre nom d'utilisateur.
- Changez votre avatar (sauf pour les utilisateurs Spotify).
- Supprimez votre compte.

---

## ✅ Prérequis

- **Node.js** ≥ 18
- **NPM** ≥ 9
- **MySQL** (pour la base de données)

---

## 🛠️ Développement

### Lancer les serveurs en mode développement

#### Backend
Utilisez `nodemon` pour recharger automatiquement le serveur lors des modifications :

```bash
cd BackMoodify
npx nodemon src/index.js
```

#### Frontend
Le serveur de développement Vite se met à jour automatiquement lors des modifications :

```bash
cd FrontMoodify
npm run dev
```

---

## 🐛 Dépannage

### Erreurs fréquentes

1. **Erreur 500 (Internal Server Error)** :
   - Vérifiez les logs du backend pour identifier la cause.
   - Assurez-vous que les variables d'environnement dans `.env` sont correctes.

2. **Erreur 404 (Not Found)** :
   - Vérifiez que les paramètres envoyés à l'API Spotify sont valides.
   - Assurez-vous que les genres ou playlists utilisés existent.

3. **Problème de connexion à la base de données** :
   - Vérifiez que MySQL est en cours d'exécution.
   - Assurez-vous que les informations de connexion dans .env sont correctes.

---


## 💡 Remerciements

Merci d'utiliser Moodify ! Si vous avez des questions ou des suggestions, n'hésitez pas à ouvrir une issue ou à contribuer au projet.
