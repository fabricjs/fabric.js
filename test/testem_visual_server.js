const http = require('http');
const path = require('path');
const chalk = require('chalk');
const busboy = require('busboy');
const { writeFileSync } = require('fs');

const PORT = 5000;

function parseRequest(req/*: http.IncomingMessage*/) {
    const bb = busboy({ headers: req.headers });
    return new Promise/*<{ files: Array<{ rawData: Buffer; } & busboy.FileInfo>; fields: { [key: string]: string | number; }; }>*/(resolve => {
        const files = []; //as Array<{ rawData: Buffer; } & busboy.FileInfo>;
        const fields = {};
        bb.on('file', (name, file, info) => {
            const raw = [];
            file.on('data', (data) => {
                raw.push(data);
            }).on('close', () => {
                files.push({ rawData: Buffer.concat(raw), ...info });
            });
        });
        bb.on('field', (name, value, info) => {
            fields[name] = value;
        });
        bb.on('close', () => {
            resolve({ files, fields });
        });
        req.pipe(bb);
    });
}

http
    .createServer(async (req, res) => {
        const { files: [{ rawData, mimeType, filename }] } = await parseRequest(req);
        console.log(path.resolve(__dirname, 'visual', 'golden', filename));
        writeFileSync(path.resolve(__dirname, 'visual', 'golden', filename), rawData, { encoding: 'binary' });
        res.end();

    })
    .listen(PORT)
    .on('listening', () => {
        console.log(chalk.bold('listening on'), chalk.blue(`http://localhost:${PORT}/`));
    });
