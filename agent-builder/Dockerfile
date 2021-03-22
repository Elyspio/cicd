# Building back
FROM  --platform=linux/amd64 node:14 as builder-back

COPY agent-builder/package.json /back/package.json
RUN cd /back && npm install

COPY agent-builder/tsconfig.json /back/tsconfig.json
COPY agent-builder/src /back/src
COPY manager/back/src /manager/back/src
RUN cd /back && npm run build

# Running
FROM docker

RUN apk add --no-cache npm git

WORKDIR /back
ENV LOG_FOLDER /logs
ENV NODE_ENV production

COPY --from=builder-back /back/package.json /back/package.json

RUN cd /back && npm i --only=production
COPY --from=builder-back /back/build /back/build

# BUILDX in container

# ensure all builds runs with Buildkit
ENV DOCKER_BUILDKIT=1
# enable full log of Buildkit builds
ENV BUILDKIT_PROGRESS=plain
# enable Buildx integration with docker
ENV DOCKER_CLI_EXPERIMENTAL=enabled

ARG BUILDX_URL=https://github.com/docker/buildx/releases/download/v0.5.1/buildx-v0.5.1.linux-amd64

RUN mkdir -p $HOME/.docker/cli-plugins && \
    wget -O $HOME/.docker/cli-plugins/docker-buildx $BUILDX_URL && \
    chmod a+x $HOME/.docker/cli-plugins/docker-buildx


RUN docker buildx create --use --name build --node build --driver-opt network=host

ADD agent-builder/prod/start.sh /start.sh

ENTRYPOINT ["sh", "/start.sh"]
