#dockerhub.odec.es/odec/frontend-kore:0.0.4
### STAGE 1: Build ###
FROM node:14.15.5 as builder

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json package-lock.json ./
RUN npm install -g @angular/cli --unsafe-perm \
 && npm install --no-progress

COPY . ./

RUN ng build --prod

### STAGE 2: Setup ###
FROM nginx:1.13.7-alpine

ENV API_URL=127.0.0.1:8080

EXPOSE 80

ENV API_URL="http://localhost:8080/context"

COPY OP/proxy.conf.template /etc/nginx/conf.d/proxy.conf.template
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /app/dist/frontend /usr/share/nginx/html

COPY docker-entrypoint.sh /

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
