FROM node:16

LABEL maintainer="Zied Touahri <zied.touahri@esprit.tn>"

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy the rest of the application source code
COPY . .

RUN chown -R node:node /home/node/app

USER node

EXPOSE 9090

CMD ["node", "server.js"]