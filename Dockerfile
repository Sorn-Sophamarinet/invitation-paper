FROM node:22-trixie AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --include=optional


FROM node:22-trixie AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run lint
RUN npm run build


FROM gcr.io/distroless/nodejs22-debian13:nonroot AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --chown=65532:65532 --from=builder /app/public ./public
COPY --chown=65532:65532 --from=builder /app/.next/standalone ./
COPY --chown=65532:65532 --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["server.js"]
