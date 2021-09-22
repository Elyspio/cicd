#!/usr/bin/env bash

docker login  -u "$DOCKER_USER" -p "$DOCKER_PASSWORD"

node /back/build/app.js
