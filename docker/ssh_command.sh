#!/bin/sh

#SSH_ORIGINAL_COMMAND="check 74cd9927-642b-4378-a4d1-000000000000 hlnew-mc-1 toto truc bidule"

pattern="^\(sleep\|check\|message\) \([0-9a-f-]\{36\}\) \([0-9a-z-]*\)\(.*\)$"
cmd=$(echo "$SSH_ORIGINAL_COMMAND" | sed -n "s/$pattern/\1/p")
uuid=$(echo "$SSH_ORIGINAL_COMMAND" | sed -n "s/$pattern/\2/p")
name=$(echo "$SSH_ORIGINAL_COMMAND" | sed -n "s/$pattern/\3/p")
args=$(echo "$SSH_ORIGINAL_COMMAND" | sed -n "s/$pattern/\4/p")
args=${args## }

if [ -z "$cmd" ] || [ -z "$uuid" ] || [ -z "$name" ]
then
    echo "Not allowed: command validation has failed..."
    exit 1
fi

case $cmd in
    sleep)
        sleep 300
        ;;
    check)
        curl -s -G "http://localhost/uuid/${uuid}" --data-urlencode "name=${name}"
        ;;
    message)
        curl -s -G "http://localhost/uuid/${uuid}" --data-urlencode "name=${name}" --data-urlencode "message=${args}"
        ;;
    *)
        echo "Error: Command not allowed: ${SSH_ORIGINAL_COMMAND}" >&2
        exit 1
        ;;
esac
