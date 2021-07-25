FROM hseeberger/scala-sbt:11.0.11_1.5.5_3.0.1


COPY ./target/universal/hive-chat-server-1.0-SNAPSHOT.zip .

COPY ./prod.conf .

RUN unzip hive-chat-server-1.0-SNAPSHOT.zip && \
    ls hive-chat-server-1.0-SNAPSHOT/bin

WORKDIR hive-chat-server-1.0-SNAPSHOT

EXPOSE 9000
EXPOSE 80
EXPOSE 443

CMD ["bin/hive-chat-server", "-Dconfig.file=../prod.conf"]