
user=`echo $DOCKER_USER`
password=`echo $DOCKER_PASSWORD`

env

docker login  -u $user -p $password

node /back/build/app.js
