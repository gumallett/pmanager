#!/usr/bin/env bash

set -e

CUR_WD=`pwd`

echo "Working dir: $1"
find "$1" -name "*.mp4" -maxdepth 1 -execdir "$CUR_WD/./scripts/video_prep.sh" '{}' \;
echo "Finished prep.sh"