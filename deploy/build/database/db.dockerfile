FROM mongo:4

COPY ./mongodb.key /data/replica.key

RUN chown 999:999 /data/replica.key
RUN chmod 400 /data/replica.key

CMD ["mongod", "--replSet", "rs0", "--bind_ip_all", "--keyFile", "/data/replica.key"]