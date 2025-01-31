FROM node:18-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Create required directories and set permissions
RUN mkdir -p uploads/reclamations public && \
    chown -R node:node uploads && \
    chmod -R 755 uploads

USER node

EXPOSE 3000

CMD ["node", "server.js"]