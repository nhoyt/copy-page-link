#!/usr/bin/env bash

GPPFILES=(
  options.css
  popup.css
  popup.js
)

SHARED=(
  background.js
  content.js
  LICENSE
  opt-common.css
  options.html
  options.js
  popup.html
  storage.js
)

# Process gpp files with browser-specific code

for FNAME in ${GPPFILES[@]}
do
  gpp -DCHROME=1 -o chrome/${FNAME} gpp-${FNAME}
done

for FNAME in ${GPPFILES[@]}
do
  gpp -DFIREFOX=1 -o firefox/${FNAME} gpp-${FNAME}
done

# Process manifest.json
gpp -o chrome/manifest.json manifest.json
gpp -DFIREFOX=1 -o firefox/manifest.json manifest.json

# Copy shared extension files to browser folders

for FNAME in ${SHARED[@]}
do
  cp -p ${FNAME} ./chrome/
  cp -p ${FNAME} ./firefox/
done

# Copy image files to browser folders

for FNAME in ./images/*
do
  cp -p ${FNAME} ./chrome/images/
  cp -p ${FNAME} ./firefox/images/
done
