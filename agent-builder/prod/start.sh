
user=`echo $DOCKER_USER`

echo $DOCKER_PASSWORD | docker login  --username $user --password-stdin

node /back/build/app.js
