# Etapa de compilación (build)
FROM node:20.11 as build

WORKDIR /app

# Instala @angular/cli globalmente
RUN npm install -g @angular/cli

# Instala dependencias
COPY package*.json ./
RUN npm install

# Copia los archivos del proyecto
COPY . .

# Compila la aplicación
RUN ng build

# Etapa de producción para servir la aplicación
FROM nginx:alpine

# Copia los archivos compilados desde la etapa de construcción
COPY --from=build /app/dist/frontend-dome/browser /usr/share/nginx/html

# Configura la exposición del puerto y el comando de inicio de Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
