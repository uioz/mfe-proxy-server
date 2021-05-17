# mfe-proxy-server

# how to make a release

> https://www.npmjs.com/package/standard-version > https://docs.npmjs.com/cli/v7/using-npm/semver#prerelease-tags

## in dev

### next

1. `npx standard-version --no-verify`
2. `git push --follow-tags origin dev`
3. `npm run build`
4. `npm publish --tag next`

### alpha

1. `npx standard-version --prerelease alpha --no-verify`
2. `git push --follow-tags origin dev`
3. `npm run build`
4. `npm publish --tag alpha`

## in master

1. `npx standard-version --no-verify`
2. `git push --follow-tags origin master`
3. `npm run build`
4. `npm publish`
