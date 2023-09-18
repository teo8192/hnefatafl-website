#!/bin/sh

git clone https://github.com/teo8192/hnefatafl-webapp.git
cd hnefatafl-webapp
wasm-pack build --target web
mkdir -p ../static
rm -r ../static/*
cp -r pkg/* ../static/
cp -r webpage/* ../static/
git log | head -n 1 > ../static/version.txt
