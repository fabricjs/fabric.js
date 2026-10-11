#!/usr/bin/env bash
set -euo pipefail

endpoint="repos/$GH_REPO/pulls/$PR_NUMBER"
pr=$(gh api "$endpoint")
review=$(gh api "$endpoint/reviews/$REVIEW_ID")
head=$(jq -r '.head.sha' <<< "$pr")
base=$(jq -r '.base.sha' <<< "$pr")
branch=$(jq -r '.head.ref' <<< "$pr")

if ! jq -e --arg repo "$GH_REPO" '.state == "open" and .draft == false and .mergeable == false and .base.ref == "master" and .head.ref != "master" and .head.repo.full_name == $repo' <<< "$pr" >/dev/null ||
   ! jq -e --arg head "$head" '.state == "APPROVED" and .commit_id == $head and .user.type == "User"' <<< "$review" >/dev/null; then
  echo '::notice::No conflict on an open repository PR with a current human approval'
  exit 0
fi
reviewer=$(jq -r '.user.login' <<< "$review")
if ! gh api "repos/$GH_REPO/collaborators/$reviewer/permission" --jq '.permission' | grep -Eq '^(write|maintain|admin)$'; then
  echo '::notice::The approving reviewer must have write access'
  exit 0
fi

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
export GIT_CONFIG_NOSYSTEM=1 GIT_CONFIG_GLOBAL=/dev/null GIT_ATTR_NOSYSTEM=1 GIT_TERMINAL_PROMPT=0
export GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=http.https://github.com/.extraheader
export GIT_CONFIG_VALUE_0="AUTHORIZATION: basic $(printf 'x-access-token:%s' "$GH_TOKEN" | base64 | tr -d '\n')"
git init --quiet "$work"
cd "$work"
git config core.hooksPath /dev/null
git config user.name 'github-actions[bot]'
git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
# Override PR attributes: only the root changelog may use union.
printf '* merge=text -filter\n/CHANGELOG.md merge=union\n' > .git/info/attributes
git remote add origin "${1:-https://github.com/$GH_REPO.git}"
git fetch --no-tags origin "refs/heads/master:refs/heads/base" "refs/pull/$PR_NUMBER/head:refs/heads/head"
if [[ $(git rev-parse head) != "$head" || $(git rev-parse base) != "$base" ]]; then
  echo '::notice::A branch changed while fetching; approve again to retry'
  exit 0
fi
git checkout --quiet --detach "$head"
if ! git merge --no-ff --no-commit "$base"; then
  echo '::notice::The merge still has conflicts; nothing will be pushed'
  exit 0
fi
git commit -m "Merge master into PR #$PR_NUMBER and resolve changelog with union"

# Confirm the PR and approval are still current before updating the branch.
pr=$(gh api "$endpoint")
review=$(gh api "$endpoint/reviews/$REVIEW_ID")
if ! jq -e --arg head "$head" --arg base "$base" --arg branch "$branch" --arg repo "$GH_REPO" '.state == "open" and .draft == false and .head.sha == $head and .base.sha == $base and .head.ref == $branch and .base.ref == "master" and .head.repo.full_name == $repo' <<< "$pr" >/dev/null ||
   ! jq -e --arg head "$head" '.state == "APPROVED" and .commit_id == $head' <<< "$review" >/dev/null; then
  echo '::notice::The PR or approval changed; nothing will be pushed'
  exit 0
fi
# The merge extends the reviewed head; the lease rejects concurrent pushes/rebases.
git push "--force-with-lease=refs/heads/$branch:$head" origin "HEAD:refs/heads/$branch"
echo '::notice::Changelog merged by github-actions[bot]; review and approve again if required'
