#   -------------------------------------------------------------
#   Nasqueron - Datasources API image
#   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
#   Project:        Nasqueron
#   Created:        2020-02-06
#   License:        BSD-2-Clause
#   -------------------------------------------------------------

FROM node:13-alpine

MAINTAINER Sébastien Santoro aka Dereckson <dereckson+nasqueron-docker@espace-win.org>

WORKDIR /srv/datasources
COPY . .

RUN npm install

ENV NODE_ENV=production
EXPOSE 80

CMD bin/www
