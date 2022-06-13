docker-compose down
docker-compose up -d --remove-orphans


sleep 4

docker exec mongodb mongo --eval "rs.initiate();" -u root -p root