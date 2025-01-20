#!/bin/sh
# wait-for-it.sh

set -e

host="$1"
shift
cmd="$@"

until nc -z -v -w30 $host; do
  echo "Waiting for MySQL database connection..."
  sleep 1
done

>&2 echo "MySQL is up - executing command"
exec $cmd
