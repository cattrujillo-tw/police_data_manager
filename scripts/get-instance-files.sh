#!/usr/bin/env bash

set -exo pipefail

BUCKET_NAME=noipm-private-images
DEST_DIRECTORY=${1-./src/instance_files}

mkdir -p $DEST_DIRECTORY

if [ -z $CI ]
then
    aws --profile noipm-personal s3 cp s3://$BUCKET_NAME $DEST_DIRECTORY --recursive
else
    AWS_ACCESS_KEY_ID=$CI_AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY=$CI_AWS_SECRET_ACCESS_KEY aws s3 cp s3://$BUCKET_NAME $DEST_DIRECTORY --recursive
fi
