# ----------------------------------------------------------
# Stage 1: Build Angular Application
# ----------------------------------------------------------
FROM node:18 AS build-stage

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files and build the app
COPY . .
RUN npm run build -- --prod

# ----------------------------------------------------------
# Stage 2: Serve with Nginx
# ----------------------------------------------------------
FROM nginx:alpine

# Copy built Angular app from previous stage
COPY --from=build-stage /app/dist/angular-tailwind /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]