FROM oven/bun:1.2-alpine AS builder
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile
RUN bun compile

FROM alpine:3.20 AS final
RUN apk add --no-cache libstdc++ libgcc
WORKDIR /app
COPY --from=builder /app/server /app/server
COPY --from=builder /app/.env /app/.env
EXPOSE 3000
ENTRYPOINT ["/app/server"]
