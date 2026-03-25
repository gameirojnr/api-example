FROM node:22-alpine AS base

RUN corepack enable && corepack prepare yarn@4.11.0 --activate

WORKDIR /app

COPY .yarnrc.yml package.json yarn.lock ./
COPY services/api/package.json services/api/package.json
COPY shared/package.json shared/package.json

RUN yarn install --immutable || yarn install

COPY tsconfig.base.json ./
COPY shared/ shared/
COPY services/api/ services/api/

# ------- dev stage (hot-reload) -------
FROM base AS dev

WORKDIR /app/services/api

ENV NODE_ENV=development
EXPOSE 3000

CMD ["yarn", "nest", "start", "--watch"]

# ------- build stage -------
FROM base AS build

RUN yarn workspace @api-example/api build

# ------- production stage -------
FROM node:22-alpine AS production

RUN corepack enable && corepack prepare yarn@4.11.0 --activate

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/shared ./shared
COPY --from=build /app/services/api/dist ./services/api/dist
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/services/api/package.json ./services/api/package.json

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "services/api/dist/main.js"]
