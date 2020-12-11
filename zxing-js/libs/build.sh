#!/bin/bash
# to call the adaptiveThreshold func 
# let adaptiveThreshold=ImageFilter.adaptiveThreshold;
# adaptiveThreshold(parass);

package_name="ImageFilter"
npx browserify ImageFilter.js --s "${package_name}" -o ./dist/ImageFilter.js
