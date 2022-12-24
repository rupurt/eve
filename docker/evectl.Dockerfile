FROM node:18.11.0-alpine3.16 AS builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY pkgs/package.json ./pkgs/package.json
COPY pkgs/evectl ./pkgs/evectl
RUN npm install
RUN npm run build --workspace @evereactor/evectl

FROM alpine:3.16.0 AS final
WORKDIR /
COPY --from=builder /app/pkgs/evectl/bin/evectl-alpine /usr/bin/evectl
ENV NODE_ENV=${NODE_ENV:-production}
CMD ["evectl"]
