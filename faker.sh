#!/bin/bash
# Be counter serial 10 unless specified
if [ ! -n "$1" ]
then
  echo "Usage: `basename $0` counterSerialNumber, defaults to serial 2"
  # Don't exit because we'll default to serial number 2
  #exit 1
fi
# default to serial number 2
SERIAL=${1:-2}
# 4-8 hours
TIMEOUT=14400
until [  $TIMEOUT -lt 1 ]; do
    # speeds ~1-100
    let SPEED=$[($RANDOM % 100) +1 ]
    # hit ever 1-5 seconds
    let TIMETONEXT=$[($RANDOM % 4) +1 ]
    echo '{"time":' $TIMEOUT ',"speed":' $SPEED',"serial":'$SERIAL'}'
    # curl the thing we want
    curl -sX POST localhost:5984/data -H "content-type: application/json" -d '{"time":"'$TIMEOUT'","speed":'$SPEED',"serialNumber":'$SERIAL'}'
    let TIMEOUT-=1
    sleep $TIMETONEXT
done
