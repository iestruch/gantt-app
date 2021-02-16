#!/usr/bin/env sh
set -ex

# Inject environment variables into NGINX configuration
# List all variables to be substituted to avoid clashing with
# NGINX own variables: https://serverfault.com/questions/577370

if [ "$1" = 'nginx' ]; then
  envsubst \
      '${API_URL} ${STATISTICS_URL} ${CROSSTAB_URL}' \
      < /etc/nginx/conf.d/proxy.conf.template \
      > /etc/nginx/conf.d/default.conf
  cat /etc/nginx/conf.d/default.conf
  exec "$@"
fi
exec "$@"
