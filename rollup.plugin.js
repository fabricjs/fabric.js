import { createFilter } from '@rollup/pluginutils';
import { parse } from 'acorn';
import chalk from 'chalk';
import { writeFileSync } from 'fs';
import path from 'path';

export function parseClassDefaultProperties(options = {}) {
    const filter = createFilter(options.include, options.exclude);

    return {
        name: 'class-default-properties',
        transform(code, id) {
            if (!filter(id)) return;
            const seg = path.relative(__dirname, id).split(path.sep);
            if (seg[0] === 'src' && seg[1] === 'shapes') {
                try {
                    const node = parse(code, {
                        sourceType: 'module',
                        ecmaVersion: 'latest'
                    });

                    node.body
                        .filter((node) => node.declaration?.type === 'ClassDeclaration')
                        .map(({ declaration: node }) => {
                            const name = node.id.name;
                            const fields = node.body.body
                                .filter((node) => node.type === 'PropertyDefinition' && !node.static)
                                .map(({ key: { name }, value: { value } }) => {
                                    return {
                                        name,
                                        value
                                    }
                                })
                                .filter(value => value.value !== undefined);
                            return {
                                name,
                                fields
                            }
                        })
                        .map((value) => {
                            const p = path.resolve(__dirname, 'defaults', `${value.name}.json`)
                            writeFileSync(p, JSON.stringify(value.fields, null, '\t'));
                            console.info(chalk.green(`created defaults file ${value.name}.json`));
                            // code += `\nexport const ${value.name}Defaults = ${JSON.stringify(value.fields, null, '\t')};`;
                        });
                } catch (error) {
                    console.error(error)
                }
            }
            // proceed with the transformation...
            return {
                code: code,
                map: null
            };
        }
    };
}