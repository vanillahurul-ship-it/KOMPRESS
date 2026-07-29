FROM node:20-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite inlines env vars at build time. Default to a same-origin relative path so the
# app works behind the nginx reverse proxy below regardless of the domain/IP it's served from.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
