#! /bin/bash

fuser -k 6000/tcp
fuser -k 7000/tcp

service redis redis_6379 start

cd ./oj-server
forever start server.js

cd ../executor
pip3 install -r requirements.txt
nohup python3 executor_server.py &

echo "==========================="

