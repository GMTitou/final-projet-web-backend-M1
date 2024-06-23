FROM node:18

WORKDIR /app

# Copiez package.json et package-lock.json
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste de l'application
COPY . .

# Compilez le projet
RUN npm run build

# Générez le client Prisma
RUN npx prisma generate

# Installez les dépendances de production
RUN npm install --only=production

# Démarrez l'application
CMD ["npm", "run", "start:prod"]
