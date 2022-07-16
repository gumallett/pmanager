#!/usr/bin/env bash

CUR_WD=`pwd`

cd /mnt/e/ /letter/new11
find . -name "*.mp4" -exec "$CUR_WD/./scripts/video_prep.sh" {} \;

