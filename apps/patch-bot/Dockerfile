FROM node:16-alpine3.15 as builder
WORKDIR /app
RUN apk add --no-cache git make clang build-base python3
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn --immutable
COPY . .
RUN yarn nx build patch-bot --prod

# stage2
FROM node:16-alpine3.15
WORKDIR /app
ARG app_version
ARG discord_bot_token
ARG features_endpoint
ARG main_private_key
ARG mongo_db_uri
ARG rpc_api_base_url
ARG sentry_url
ARG solscan_api_token
ENV ENVIRONMENT production
ENV APP_VERSION $app_version
ENV DISCORD_BOT_TOKEN $discord_bot_token
ENV FEATURES_ENDPOINT $features_endpoint
ENV MAIN_PRIVATE_KEY $main_private_key
ENV MONGO_DB_URI $mongo_db_uri
ENV RPC_API_BASE_URL $rpc_api_base_url
ENV SENTRY_URL $sentry_url
ENV SOLSCAN_API_TOKEN $solscan_api_token
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/ ./node_modules
RUN ls -la
CMD ["node", "./dist/apps/patch-bot/main.cjs"]
