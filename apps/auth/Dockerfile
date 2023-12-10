# Development
FROM node:20-alpine3.17 as development
WORKDIR /learningPlatform/code/auth
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build auth

# Production
FROM node:alpine as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /learningPlatform/code/auth
COPY package*.json ./
RUN npm ci --only=production
COPY . .
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/apps/auth/main"]