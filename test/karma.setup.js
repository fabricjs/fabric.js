// // the jest.fn() API
// import jest from "jest-mock";
// // The matchers API
// import expect from "expect";

// Add missing Jest functions
// window.test = window.it;
// window.test.each = (inputs) => (testName, test) =>
//   inputs.forEach((args) => window.it(testName, () => test(...args)));
// window.test.todo = function () {
//   return undefined;
// };
// window.jest = jest;
// window.expect = expect;


window.isNode = () => false;

window.TEST_CONFIG = window.__karma__.config;


// QUnit setup

QUnit.testDone(visualCallback.testDone.bind(visualCallback));

// test setup

const canvas = document.createElement('canvas');
canvas.id = 'canvas';
canvas.width = canvas.height = 500;

const staticCanvas = document.createElement('canvas');
staticCanvas.id = 'static-canvas';
staticCanvas.width = staticCanvas.height = 500;



const visualOutputTemplate = document.createElement('template')
visualOutputTemplate.id = 'error_output';
visualOutputTemplate.innerHTML = `
    <table>
        <thead>
            <row>
                <th class="text-center">expected</th>
                <th class="text-center">actual</th>
                <th class="text-center">diff</th>
            </row>
        </thead>
        <tbody>
            <row>
                <td data-canvas-type="expected"></td>
                <td data-canvas-type="actual"></td>
                <td data-canvas-type="diff"></td>
            </row>
        </tbody>
    </table>
    `;

document.body.append(canvas, staticCanvas, visualOutputTemplate);
