# FabricJS extensions or plugins

Extensions and/or plugins are all those features that do no have a place in the library itself.
FabricJS is a rendering library with an interactive layer and serialization support and has already a lot of features and needs to avoid more scope creep.

Extension are all those pieces of codes that are more features and less api, as examples:

- filters with a niche use case
- high level interactions like guidelines or snapping
- high level objects that pertain to UX
- Controls sets that could be built with the api but are pre-built here so developers have a reference implementation

## Requirements for a feature

A feature in order to be merged needs to have

- Unit tests
- An e2e test if there is an interaction flow
- A small Readme file that explain how to use it and what to expect from it

## How to use features

Each feature is built how is built.
It may be a class or a function that wrap an existing class, or a series of functions to use in a particular way.
Refer to each README file for explanations

Feature are not built in the main FabricJS bundle and are available both in form of ES module or an extension bundle.
