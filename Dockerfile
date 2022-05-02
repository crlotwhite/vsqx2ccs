FROM node:16

MAINTAINER "nv.noelvalent@gmail.com"

COPY . /opt/vsqx2ccs
WORKDIR /opt/vsqx2ccs

RUN npm install

EXPOSE 8080

ENTRYPOINT ["npm", "start"]
