FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Create required directories
RUN mkdir -p uploads/reclamations public

EXPOSE 3000

CMD ["node", "server.js"]