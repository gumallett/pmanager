#!/usr/bin/env bash

CUR_WD=`pwd`

echo "Working dir: $1"
find "$1" -name "*.mp4" -exec "$CUR_WD/./scripts/video_prep.sh" {} \;
