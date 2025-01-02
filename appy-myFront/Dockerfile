FROM node:20.18.1-alpine as builder
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
