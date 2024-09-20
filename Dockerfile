# Etapa de compilación (build)
FROM node:20.11 as build

WORKDIR /app

# Instala @angular/cli globalmente
RUN npm install -g @angular/cli

# Define un argumento para la configuración de Angular
ARG BUILD_ENV=production

# Instala dependencias
COPY package*.json ./
RUN npm install

# Copia los archivos del proyecto
COPY . .

# Compila la aplicación con la configuración especificada
RUN ng build --configuration=$BUILD_ENV

# Etapa de producción para servir la aplicación
FROM nginx:alpine

# Copia los archivos compilados desde la etapa de construcción
COPY --from=build /app/dist/frontend-dome/browser /usr/share/nginx/html

# Copia la configuración personalizada de Nginx (si es necesario)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposición del puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
