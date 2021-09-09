# Building back
FROM  --platform=linux/amd64 node:14 as builder-back


RUN mkdir /back

COPY ./nodes/hub/back/package*.json /back
RUN cd /back && npm install

COPY ./nodes/hub/back/src /back/src
COPY ./nodes/hub/back/tsconfig.json /back/tsconfig.json
RUN cd /back && npm run build

# Building front
FROM --platform=linux/amd64 node:16 as builder-front

RUN mkdir /front


COPY ./nodes/hub/front/package*.json /front
RUN cd /front && npm install

COPY ./nodes/hub/front/tsconfig.json /front/tsconfig.json
COPY ./nodes/hub/front/public /front/public
COPY ./nodes/hub/back/src /back/src
COPY ./nodes/hub/front/src /front/src
RUN cd /front && npm run build

# Running
FROM node:16-alpine

RUN mkdir /back

COPY --from=builder-back /back/package*.json /back
RUN cd /back && npm i --only=prod
COPY --from=builder-back /back/build /back/build
COPY --from=builder-front /front/build /front/build


WORKDIR /back
ENV LOG_FOLDER /logs
ENV NODE_ENV production

RUN apk add --no-cache git

CMD ["node", "build/app.js"]
