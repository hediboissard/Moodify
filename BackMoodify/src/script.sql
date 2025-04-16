-- Création de la base de données
CREATE DATABASE IF NOT EXISTS moodify;

USE moodify;

-- Supprimer la table users si elle existe
DROP TABLE IF EXISTS users;

<<<<<<< HEAD

=======
--Création de la table users
>>>>>>> dcd264caa16348ee3a1ce0363cee1e20fa96af03
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(191) NOT NULL UNIQUE,
  password VARCHAR(255),
  username VARCHAR(100) NOT NULL,
  spotify_id VARCHAR(255),
  mood VARCHAR(50),
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
<<<<<<< HEAD
);
=======
);
>>>>>>> dcd264caa16348ee3a1ce0363cee1e20fa96af03
