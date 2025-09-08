#!/bin/bash

set -xe

sudo systemctl stop postgresql
sudo systemctl start docker
cd ./asa-armenia && docker compose up -d mongo && docker compose up -d postgresql 
