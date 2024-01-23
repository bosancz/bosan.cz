FROM node:18-alpine

WORKDIR /workspace

# system utilities
RUN apk add --no-cache git nano lsof openjdk8-jre

# build tools (gcc)
RUN apk add --no-cache alpine-sdk python3  

# development tools
RUN npm i -g @angular/cli @nestjs/cli

# set up git
RUN git config --global --add safe.directory /workspace && git config --global core.autocrlf true

CMD /bin/sh -c "while sleep 1000; do :; done"