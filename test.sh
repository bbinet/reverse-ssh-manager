#!/bin/sh

for i in a d c e b
do
    curl "http://localhost:8888/uuid/${i}2b9c4cf-42b6-4d04-becb-606ccb419eaf?name=${i}"
done
