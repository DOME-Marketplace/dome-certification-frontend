# Etapa de compilación (build)
FROM node:20.11 as build

WORKDIR /app

# Copia archivos de configuración basados en la variable de entorno
ARG ENVIRONMENT=development
COPY ./src/environments/environment.${ENVIRONMENT}.ts ./src/environments/environment.ts

# Instala dependencias
COPY package*.json ./
RUN npm install

# Copia los archivos del proyecto
COPY . .

# Compila la aplicación
RUN npm run build --prod

# Etapa de producción
FROM nginx:alpine
COPY --from=build /app/dist/my-angular-app /usr/share/nginx/html

# Copia la configuración de nginx dependiendo del entorno
COPY nginx/nginx.${ENVIRONMENT}.conf /etc/nginx/conf.d/default.conf
