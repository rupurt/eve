FROM node:18.18.2-alpine3.17 AS builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY tsconfig.base.json .
COPY pkgs/package.json ./pkgs/package.json
COPY pkgs/ucli ./pkgs/ucli
RUN npm install
RUN npm run build --workspace @evereactor/ucli

FROM alpine:3.16.0 AS final
WORKDIR /
COPY --from=builder /app/pkgs/ucli/bin/ucli-alpine /usr/bin/eve
ENV NODE_ENV=${NODE_ENV:-production}
CMD ["eve", "broker", "start"]
