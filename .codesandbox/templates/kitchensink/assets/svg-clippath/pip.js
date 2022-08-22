const fs = require('fs')
const path = require('path')
const _ = require('lodash')

//export default as ${_.camelCase(path.parse(file).name)}

const content = [];
const _exports = [];

fs.readdirSync(__dirname).filter(file => fs.lstatSync(path.resolve(__dirname, file)).isFile() && file !== path.basename(__filename))
    .map(file => {
        const newPath = path.resolve(__dirname, file.replace('-', ''));
        fs.renameSync(path.resolve(__dirname, file), newPath)
        // content.push(`import ${name} from './${newPath}'`);
        // _exports.push(name);
    }).join('\n')


// fs.writeFileSync('./index.ts', `${content.join('\n')}\n\nexport {${_exports.join(',\n')}};`)