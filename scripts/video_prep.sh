#!/usr/bin/env bash

set -e

input=$1
output=$(echo "${input%.*}")

# extract frame at 10s mark and save as png image
ffmpeg -nostdin -nostats -y -i "$input" -ss 00:00:15.000 -vframes 1 "$output-thumb.png"

# resize image for thumbnail purposes
mogrify -geometry 320x "$output-thumb.png"

# create 10 sec preview clip from a movie
ffmpeg -nostdin -nostats -ss 00:00:10 -y -report -i "$input" -codec copy -t 0:00:10 -an "$output-thumb.mp4"

