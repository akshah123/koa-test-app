FROM node:12.14.1-alpine
WORKDIR /app

RUN apk add --no-cache gettext jq tini curl

# Assumes a base image named "modules" in the "child" Dockerfile
ONBUILD COPY --from=modules /app/modules /app/modules
ONBUILD ARG  NODE_ENV=development
ONBUILD ENV  NODE_ENV ${NODE_ENV}
ONBUILD COPY package.json package.json
ONBUILD RUN  yarn install && yarn cache clean

# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
# All COPY and ADD commands do not respect USER (they are run as root)
# Therefore, we leave this to the very last step
ONBUILD RUN  chown -R node:node /app
ONBUILD ENV  HOME /home/node
ONBUILD USER node

# Set up our runtime, then execute any passed in CMD
#

ENV SERVICE_NAME test-app

COPY knexfile.js       knexfile.js
COPY migrations        migrations
COPY package.json      package.json
COPY yarn.lock         yarn.lock
COPY src               src

# Overwrite default start command in order to run migrations
# see package.json for script details
RUN ["yarn"]
CMD ["yarn", "dev:start"]
