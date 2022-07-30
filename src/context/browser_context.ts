
export const context = {
    document: document instanceof (typeof HTMLDocument !== 'undefined' ? HTMLDocument : Document) ?
        document :
        document.implementation.createHTMLDocument(''),
    window: window
};
