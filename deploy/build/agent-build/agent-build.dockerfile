# Building back
FROM  --platform=linux/amd64 node:16 as builder


RUN mkdir /back
RUN mkdir /hub

COPY ./nodes/agent-builder/package*.json /back
RUN cd /back && npm install

COPY ./nodes/agent-builder/tsconfig.json /back/tsconfig.json
COPY ./nodes/agent-builder/src /back/src
COPY ./nodes/hub/back/src /hub/back/src
RUN cd /back && npm run build

# Running
FROM node:16

RUN apt update && apt-get install -y git curl && rm -rf /var/lib/apt/lists/* &&  npm i -g npm
RUN curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh && rm get-docker.sh

RUN mkdir back

WORKDIR /back
ENV NODE_ENV production


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

ADD ./deploy/build/agent-build/start.sh /start.sh


COPY --from=builder /back/package*.json /back

RUN cd /back && npm i --only=prod
COPY --from=builder /back/build /back/build


ENTRYPOINT ["sh", "/start.sh"]
