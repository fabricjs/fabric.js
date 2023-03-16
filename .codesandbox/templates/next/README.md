# Fabric Next.js Sandbox

A [`Next.js`](https://nextjs.org/) app for reproducing `fabric` issues and creating examples.
`Next.js` is built with both client and server code so we can test `fabric` in the browser and on node in a single example.

## Reproducing

Creating a clear, easy to use reproduction in very **IMPORTANT**.
Keep it simple and concise.
Don't add stuff that is out of scope.

Provide a **detailed description** including steps to reproduce in the `REPRODUCE.md` file.

## Browser Reproduction

Naviagate to `pages/index` and start editing.

## Node Reproduction

Naviagate to `api/fabric` to see how to expose a server endpoint.
All `Next.js` endpoints are available to the app at `/api/XXX`, `XXX` being the endpoint file name.
