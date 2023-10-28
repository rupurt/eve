FROM node:18.11.0-alpine3.16 AS builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY tsconfig.base.json .
COPY pkgs/package.json ./pkgs/package.json
COPY pkgs/broker ./pkgs/broker
RUN npm install
RUN npm run build --workspace @evereactor/broker

FROM alpine:3.16.0 AS final
WORKDIR /
COPY --from=builder /app/pkgs/broker/bin/broker-alpine /usr/bin/broker
ENV NODE_ENV=${NODE_ENV:-production}
CMD ["broker", "start"]
