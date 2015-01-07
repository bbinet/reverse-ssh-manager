#!/bin/sh

#SSH_ORIGINAL_COMMAND="${SSH_ORIGINAL_COMMAND:-${1}}"

command="${SSH_ORIGINAL_COMMAND%% *}"
args="${SSH_ORIGINAL_COMMAND##${command} }"
    
case $command in
    sleep)
        sleep 300
        ;;
    check)
        uuid="${args%% *}"
        name="${args##${uuid} }"
        curl "http://localhost:8888/uuid/${uuid}?name=${name}"
        ;;
    *)
        echo "Error: Command not allowed: ${SSH_ORIGINAL_COMMAND}" >&2
        exit 1
        ;;
esac
