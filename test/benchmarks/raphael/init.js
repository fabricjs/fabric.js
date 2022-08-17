
async function run(runner) {
    const testContext = new TestContext();
    await runner(testContext);
    return testContext.finish();
}

async function test(raphaelContainer, canvasEl) {
    const raphaelResults = await run((testContext) => runRaphael(raphaelContainer, testContext));
    const fabricResults = await run((testContext) => runFabric(canvasEl, testContext));

    function parseResults(res) {
        return Object.keys(res).map(key => `${key}: ${res[key]} ms`).join('<br>');
    }

    document.getElementById('raphael_result').innerHTML = parseResults(raphaelResults)
    document.getElementById('fabric_result').innerHTML = parseResults(fabricResults);

    window.parent.postMessage({
        type: 'test',
        name: 'image replicas',
        fabric: fabricResults,
        raphael: raphaelResults,
        // maxResults: {
        //     total: 40
        // }
    }, '*');
}

const preloaded = [];

function preload(target) {
    preloaded.push(target);
    const children = document.getElementById('preload').children;
    for (let index = 0; index < children.length; index++) {
        if (!preloaded.includes(children[index])) return;
    }
    start();
}

function start() {
    test(document.getElementById('raphael'), document.getElementById('canvas'));
}

window.addEventListener('load', () => {
    const children = document.getElementById('preload').children;
    if (children.length === 0) start();
});