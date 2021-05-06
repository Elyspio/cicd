# Building back
FROM  --platform=linux/amd64 node:14 as builder-back

COPY agent-prod/package.json /back/package.json
RUN cd /back && npm install

COPY agent-prod/tsconfig.json /back/tsconfig.json
COPY agent-prod/src /back/src
COPY manager/back/src /manager/back/src
RUN cd /back && npm run build

# Running
FROM node:14-alpine

COPY --from=builder-back /back/package.json /back/package.json
RUN cd /back && npm i --only=production
COPY --from=builder-back /back/build /back/build

WORKDIR /back
ENV LOG_FOLDER /logs
ENV NODE_ENV production
CMD ["node", "build/app.js"]
