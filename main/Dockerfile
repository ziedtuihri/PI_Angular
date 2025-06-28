FROM node:16

LABEL maintainer="Zied Touahri <zied.touahri@esprit.tn>"

# Create app directory and set permissions
WORKDIR /home/node/app

# Copy package files and install dependencies
COPY package*.json ./

RUN npm ci

#RUN npm install --production

# Copy the rest of the application source code
COPY . .

RUN npm run build -- --prod

# Ensure correct ownership
RUN chown -R node:node /home/node/app

USER node

EXPOSE 9090

CMD ["node", "server.js"]