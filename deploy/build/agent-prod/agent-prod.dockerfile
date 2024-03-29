# Building back
FROM  --platform=linux/amd64 node:16 as builder-back


RUN mkdir /back
RUN mkdir /hub

COPY ./nodes/agent-prod/package*.json /back
RUN cd /back && npm install


COPY ./nodes/agent-prod/tsconfig.json /back/tsconfig.json
COPY ./nodes/agent-prod/src /back/src
COPY ./nodes/hub/back/src /hub/back/src
RUN cd /back && npm run build

# Running
FROM node:16-alpine

RUN apk --no-cache add curl bash

RUN curl -L https://github.com/docker/compose/releases/download/v2.1.0/docker-compose-`uname -s`-`uname -m` -o /usr/bin/docker-compose
RUN chmod +x /usr/bin/docker-compose

RUN mkdir back

COPY --from=builder-back /back/package*.json /back
RUN cd /back && npm i --only=prod
COPY --from=builder-back /back/build /back/build

WORKDIR /back
ENV NODE_ENV production
CMD ["node", "/back/build/app.js"]
