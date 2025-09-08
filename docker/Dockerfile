FROM nginx

COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/nginx/conf.d /etc/nginx/conf.d
COPY ./dist /usr/share/nginx/html/dist

ENTRYPOINT ["nginx", "-g", "daemon off;"]