# Image Node officielle
FROM node:20-alpine

# Dossier de travail dans le container
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le projet
COPY . .

# Build de l'application
RUN npm run build

# Exposer le port de Nuxt
EXPOSE 3000

# Lancer l'application
CMD ["npm", "run", "dev"]