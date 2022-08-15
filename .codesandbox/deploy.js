#!/usr/bin/env node
const fs = require('fs-extra');
const Axios = require('axios');
const chalk = require('chalk');
const path = require('path');

const BINARY_EXT = [
    'png',
    'jpg',
    'jpeg'
];

function bufferToBase64DataUrl(buffer, mimeType) {
    return 'data:' + mimeType + ';base64,' + buffer.toString('base64');
}

/**
 * https://codesandbox.io/docs/api/#define-api
 */
async function createCodeSandbox(appPath) {
    const files = {};
    const processFile = (fileName) => {
        const filePath = path.resolve(appPath, fileName);
        const ext = path.extname(fileName).slice(1);
        if (fs.lstatSync(filePath).isDirectory()) {
            fs.readdirSync(filePath)
                .forEach(file => {
                    processFile(path.join(fileName, file).replace(/\\/g, '/'));
                });
        } else if (BINARY_EXT.some(x => x === ext)) {
            files[fileName] = {
                content: bufferToBase64DataUrl(fs.readFileSync(filePath), `image/${ext}`),
                isBinary: true
            };
        } else {
            files[fileName] = { content: fs.readFileSync(filePath).toString() };
        }
    }
    fs.readdirSync(appPath).forEach(processFile);
    try {
        const { data: { sandbox_id } } = await Axios.post("https://codesandbox.io/api/v1/sandboxes/define?json=1", {
            template: JSON.parse(fs.readFileSync(path.resolve(appPath, 'sandbox.config.json')) || null).template,
            files,

        });
        const uri = `https://codesandbox.io/s/${sandbox_id}`;
        console.log(chalk.yellow(`> created codesandbox ${uri}`));
        return uri;
    } catch (error) {
        throw error.toJSON();
    }
}

module.exports = {
    createCodeSandbox
}