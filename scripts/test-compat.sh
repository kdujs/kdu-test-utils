#!/bin/sh

set -e

run() {
  echo "running unit tests with Kdu $1"
  yarn add --pure-lockfile --non-interactive -W -D "kdu@$1" "kdu-template-compiler@$1" "kdu-server-renderer@$1"
  yarn test:unit:only
  yarn test:unit:karma:only
}

yarn build:test

if [ "$1" ]; then
  run "$1"
  exit
fi

kdu_version=$(yarn -s info kdu version)
kdu_major=$(echo "$kdu_version" | cut -d. -f1)
kdu_minor=$(echo "$kdu_version" | cut -d. -f2)

while [ "$kdu_minor" -gt 0 ]; do
  kdu_minor=$((kdu_minor - 1))

  run "${kdu_major}.${kdu_minor}"
done
