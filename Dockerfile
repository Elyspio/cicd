FROM alpine
COPY ./a.txt a.txt
COPY ./b.txt b.txt

CMD ["cat", "a.txt", "b.txt"]
