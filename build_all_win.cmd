echo 'building minified src files';
node build.js build-minified;

echo 'creating build.sh with all module combinations (minified and not)';
node create_build_script.js;

echo 'removing all previous module files';
del /s ..\fabricjs.com\build\files;
mkdir ..\fabricjs.com\build\files;

echo 'building actual distribution files with all module combinations (minified and not)';
.\build.sh;

echo 'removing tmp files';
del /s tmp;
mkdir tmp;

echo 'erasing build.sh';
echo "" > build.sh;
