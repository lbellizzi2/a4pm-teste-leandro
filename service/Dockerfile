# BUILDER STAGE
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma/

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma:generate
# RUN yarn prisma:migrate:deploy

RUN yarn build

# RUNTIME STAGE
FROM node:lts-alpine AS runtime

WORKDIR /app

COPY --from=builder "/app/dist/" "/app/dist/"
COPY --from=builder "/app/node_modules/" "/app/node_modules/"
COPY --from=builder "/app/package.json" "/app/package.json"
COPY --from=builder "/app/yarn.lock" "/app/yarn.lock"

RUN yarn install --frozen-lockfile --production

EXPOSE 3016

CMD ["yarn", "start"]
