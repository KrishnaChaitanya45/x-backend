# Development
FROM node:20-alpine3.17 as development
WORKDIR /learningPlatform/code
COPY package*.json ./
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm ci --only=production; \
    fi
COPY . .

CMD ["npm", "run", "start:dev"]

#Production 
# FROM node:20-alpine3.17 as production
# # pass an argument for dev or prod
# ARG NODE_ENV=production
# ENV NODE_ENV = ${NODE_ENV}
# WORKDIR /learningPlatform/code
# COPY package*.json ./
# RUN npm ci --only=production;
# COPY --from=development /learningPlatform/code/dist ./dist

# CMD ["node", "dist/index.js"]
