FROM node:18.11.0-alpine3.16 AS builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY pkgs/package.json ./pkgs/package.json
COPY pkgs/webui ./pkgs/webui
RUN npm install
RUN npm run build --workspace @evereactor/webui

FROM alpine:3.16.0 AS final
WORKDIR /
COPY --from=builder /app/pkgs/webui/bin/webui-alpine /usr/bin/webui
ENV NODE_ENV=${NODE_ENV:-production}
CMD ["webui", "start"]
