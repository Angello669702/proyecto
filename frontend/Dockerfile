FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM httpd:alpine
COPY --from=build /app/dist/frontend/browser /usr/local/apache2/htdocs/
EXPOSE 80
