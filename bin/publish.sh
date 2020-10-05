#!/usr/bin/env bash
set -eo pipefail

# bump version and save version num
# Note: npm install on jenkins touches package-lock
# but it doesnt happen on local, so we do
# git checkout to reset the files back
git checkout .
# get out of detached HEAD state
git checkout ${BRANCH_NAME}

# bump the patch version
npm --quiet version patch -m "[ci-skip] Jenkins - %s"

# publish version
echo 'Performing npm publish'
npm publish

# push git commit + tag
# Note: we need to add the SSH remote URL otherwise
# this errors when trying to push via HTTPS
git remote add origin-update git@github.com:amplify-education/fabric.js.git
git push origin-update ${BRANCH_NAME} --follow-tags