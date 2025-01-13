# Usando una imagen base de Node.js
FROM node:23.5.0

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto
EXPOSE 3002

# Comando para correr la aplicación
CMD ["npm", "run", "start"]
