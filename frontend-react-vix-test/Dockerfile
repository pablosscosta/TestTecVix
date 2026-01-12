# Build Stage
FROM node:20.18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build


# Production Stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar a configuração do NGINX personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY public /usr/share/nginx/html/public

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]