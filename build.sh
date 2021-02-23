#!/usr/bin/env bash

GPPFILES=(
  background
  content
  options
)

# Process extension JS files: output to browser folders

for FNAME in ${GPPFILES[@]}
do
  gpp -DCHROME=1 -o chrome/${FNAME}.js gpp-${FNAME}.js
done

for FNAME in ${GPPFILES[@]}
do
  gpp -DFIREFOX=1 -o firefox/${FNAME}.js gpp-${FNAME}.js
done

# Process manifest.json
gpp -o chrome/manifest.json manifest.json
gpp -DFIREFOX=1 -o firefox/manifest.json manifest.json

# Copy shared extension files to browser folders

for FNAME in ./shared/*
do
  cp ${FNAME} ./chrome/
  cp ${FNAME} ./firefox/
done

# Copy image files to browser folders

for FNAME in ./images/*
do
  cp ${FNAME} ./chrome/images/
  cp ${FNAME} ./firefox/images/
done
