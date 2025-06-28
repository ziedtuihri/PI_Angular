# Étape 1 : Build Angular
FROM node:18 as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --prod

# Étape 2 : Serveur Nginx
FROM nginx:alpine

COPY --from=build-stage /app/dist/angular-tailwind /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]