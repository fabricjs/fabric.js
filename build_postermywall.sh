#! /bin/bash

node build.js modules=animation,interaction,gestures,image_filters,text,itext,textbox,shadow

cp ./dist/fabric.js /Applications/MAMP/htdocs/pmw/assets/javascript/vendor/fabric.js

echo 'Copied file to PosterMyWall web.'