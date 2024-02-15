#!/usr/bin/env bash

set -e

# Usage create-vod-hls.sh SOURCE_FILE OUTPUT_DIR
[[ ! "${1}" ]] || [[ ! "${2}" ]] && echo "Usage: create-vod-hls.sh SOURCE_FILE OUTPUT_DIR" && exit 1

# comment/add lines here to control which renditions would be created
renditions=(
# resolution  bitrate  audio-rate
#  "426x240    400k    64k"
  "640x360    800k     96k"
  "842x480    1400k    128k"
  "1280x720   2800k    128k"
  "1920x1080  5000k    192k"
)

segment_target_duration=15       # try to create a new segment every X seconds
max_bitrate_ratio=107           # maximum accepted bitrate fluctuations (multiplied by 100 to handle in bash)
rate_monitor_buffer_ratio=150   # maximum buffer size between bitrate conformance checks (multiplied by 100 to handle in bash)

#########################################################################

source="${1}"
target="${2}"
mkdir -p ${target}

fps=$(ffprobe ${source} 2>&1 | grep -oE '[[:digit:]]+(.[[:digit:]]+)? fps' | grep -oE '[[:digit:]]+(.[[:digit:]]+)?')
fps=${fps%.*} # truncate to integer
key_frames_interval=$((fps*2))

# static parameters that are similar for all renditions
static_params="-c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0"
static_params+=" -g ${key_frames_interval} -keyint_min ${key_frames_interval} -hls_time ${segment_target_duration}"
static_params+=" -hls_playlist_type vod"

# misc params
misc_params="-hide_banner -y"

master_playlist="#EXTM3U
#EXT-X-VERSION:3
"
cmd=""
for rendition in "${renditions[@]}"; do
  # drop extraneous spaces
  rendition="${rendition/[[:space:]]+/ }"

  # rendition fields
  resolution="$(echo ${rendition} | cut -d ' ' -f 1)"
  bitrate="$(echo ${rendition} | cut -d ' ' -f 2)"
  audiorate="$(echo ${rendition} | cut -d ' ' -f 3)"

  # calculated fields
  width="$(echo ${resolution} | grep -oE '^[[:digit:]]+')"
  height="$(echo ${resolution} | grep -oE '[[:digit:]]+$')"
  bitrate_num="$(echo ${bitrate} | grep -oE '[[:digit:]]+')"
  maxrate=$(((bitrate_num*max_bitrate_ratio)/100))
  bufsize=$(((bitrate_num*rate_monitor_buffer_ratio)/100))
  bandwidth="${bitrate_num}000"
  name="${height}p"
  
  cmd+=" ${static_params} -vf scale=w=${width}:h=${height}"
  cmd+=" -b:v ${bitrate} -maxrate ${maxrate}k -bufsize ${bufsize}k -b:a ${audiorate}"
  cmd+=" -hls_segment_filename ${target}/${name}_%03d.ts ${target}/${name}.m3u8"
  
  # add rendition entry in the master playlist
  master_playlist+="#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${name}.m3u8\n"
done

# start conversion
echo -e "Executing command:\nffmpeg ${misc_params} -i ${source} ${cmd}"
ffmpeg ${misc_params} -i ${source} ${cmd}

# create master playlist file
echo -e "${master_playlist}" > ${target}/playlist.m3u8
