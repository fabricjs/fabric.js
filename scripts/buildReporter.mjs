import { Command } from "commander";
import { report } from "./buildLock.mjs";

const program = new Command();

program
    .command('<type> [...args]')
    .action((type) => {
        report(type);
    })
    .parse(process.argv);
