#!/usr/bin/env bash

GPPFILES=(
  background
  content
  options
  popup
)

# Run gpp on gpp-*.js files and output in chrome and firefox folders

for FNAME in ${GPPFILES[@]}
do
  gpp -DCHROME=1 -o chrome/${FNAME}.js gpp-${FNAME}.js
done

for FNAME in ${GPPFILES[@]}
do
  gpp -DFIREFOX=1 -o test/${FNAME}.js gpp-${FNAME}.js
done

#for FNAME in ${GPPFILES[@]}
#do
#  echo gpp -DFIREFOX=1 -o firefox/${FNAME}.js gpp-${FNAME}.js
#done

# Copy shared extension files to both browser folders

for FNAME in ./shared/*
do
  echo cp ${FNAME} ./chrome/
  echo cp ${FNAME} ./firefox/
done
