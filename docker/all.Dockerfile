FROM node:18.11.0-alpine3.16 AS builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY tsconfig.base.json .
COPY pkgs/package.json ./pkgs/package.json
COPY pkgs/broker ./pkgs/broker
COPY pkgs/evectl ./pkgs/evectl
COPY pkgs/ucli ./pkgs/ucli
COPY pkgs/webui ./pkgs/webui
RUN npm install
RUN npm run build

FROM alpine:3.16.0 AS final
WORKDIR /
COPY --from=builder /app/pkgs/broker/bin/broker-alpine /usr/bin/broker
COPY --from=builder /app/pkgs/evectl/bin/evectl-alpine /usr/bin/evectl
COPY --from=builder /app/pkgs/ucli/bin/ucli-alpine /usr/bin/eve
COPY --from=builder /app/pkgs/webui/bin/webui-alpine /usr/bin/webui
ENV NODE_ENV=${NODE_ENV:-production}
CMD ["eve", "broker", "start"]
