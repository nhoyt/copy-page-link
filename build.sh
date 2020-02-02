#!/usr/bin/env bash

GPPFILES=(
  background
  content
  options
  popup
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

# Copy shared extension files to browser folders

for FNAME in ./shared/*
do
  cp ${FNAME} ./chrome/
  cp ${FNAME} ./firefox/
done
