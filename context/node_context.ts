//@ts-nocheck
import { JSDOM } from 'jsdom';

const virtualWindow = new JSDOM(
    decodeURIComponent('%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E'),
    {
        features: {
            FetchExternalResources: ['img']
        },
        resources: 'usable'
    }).window;

export const context = {
    document: virtualWindow.document,
    window: virtualWindow,
    jsdomImplForWrapper: require('jsdom/lib/jsdom/living/generated/utils').implForWrapper,
    nodeCanvas: require('jsdom/lib/jsdom/utils').Canvas,
    DOMParser: virtualWindow.DOMParser
};