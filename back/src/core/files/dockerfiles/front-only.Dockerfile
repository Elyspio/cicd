# Building front
FROM --platform=linux/amd64 node:14 as builder-front

COPY front/package.json /front/package.json
RUN cd /front && npm install

COPY front/tsconfig.json /front/tsconfig.json
COPY front/public /front/public
COPY front/src /front/src
RUN cd /front && npm run build

# Running
FROM node:14-alpine

RUN npm i -g serve
COPY --from=builder-front /front/build /front

WORKDIR /front

EXPOSE 5000

CMD ["serve", "."]
