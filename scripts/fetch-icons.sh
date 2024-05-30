#!/usr/bin/env bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

camelize() {
    echo "$1" | node.exe "$SCRIPT_DIR/camelize.js"
}

ICONS="$SCRIPT_DIR/../src/assets/icons/xiv"

# <jobname> <iconUrl> "<Action Name>"
downloadIcon() {
    job="$1"; shift
    iconUrl="$1"; shift
    # concat remainder as actionName so it can be unquoted
    actionName="$@"
    actionId=$(camelize "$actionName")
    mkdir "$ICONS/$job"
    destination="$ICONS/$job/$actionId.png"
    curl "$iconUrl" > "$destination"
}

echoParams() {
    echo "1: $1"
    echo "2: $2"
    echo "3: $3"
}

pipeDownload() {
    while read -r data; do
        downloadIcon $data
    done
}

# Produces a line per iconUrl:
# <jobname> <iconUrl> "<Action Name>"
extractJobActionUrls() {
    # for each key j
    #   for each item in j's actions
    #       print j icon name
    jq -cr '. | keys[] as $j | "\($j) \(.[$j] | .actions[] | .icon + " " + .name)"' XIVFinal.json
}

extractJobActionUrls | pipeDownload