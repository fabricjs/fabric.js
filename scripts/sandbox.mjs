import chalk from 'chalk';
import * as commander from 'commander';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import path from 'node:path';
import process from 'node:process';
import { createCodeSandbox, ignore } from '../.codesandbox/deploy.mjs';
import { startSandbox } from '../.codesandbox/start.mjs';
import { wd } from './dirname.mjs';

const program = new commander.Command()
  .showHelpAfterError()
  .allowUnknownOption(false)
  .allowExcessArguments(false);

const codesandboxTemplatesDir = path.resolve(wd, '.codesandbox', 'templates');

const sandbox = program.command('sandbox').description('sandbox commands');

const templates = fs.readdirSync(codesandboxTemplatesDir);

program
  .command('start')
  .description('start a sandbox app')
  .addArgument(
    new commander.Argument('<template>', 'template to use').choices(templates),
  )
  .option('-w, --watch', 'build and watch fabric', true)
  .option(
    '--no-watch',
    'use this option if you have another process watching fabric',
  )
  .action(async (template, { watch }) => {
    const pathToSandbox = path.resolve(codesandboxTemplatesDir, template);
    startSandbox(pathToSandbox, watch);
  });

sandbox
  .command('deploy')
  .argument('[path]', 'directory to upload')
  .description('deploy a sandbox to codesandbox')
  .addOption(
    new commander.Option(
      '-t, --template <template>',
      'template to use instead of a "path"',
    ).choices(templates),
  )
  .action(async (deploy, { template }, context) => {
    if (!deploy && !template) {
      console.log(chalk.red(`Provide "path" or "--template"`));
      context.help({ error: true });
      return;
    } else if (
      !template &&
      !fs.existsSync(deploy) &&
      templates.includes(deploy)
    ) {
      template = deploy;
      deploy = undefined;
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Did you mean to run ${chalk.blue(
            `npm run sandbox deploy -- -t ${template}\n`,
          )}?`,
          default: true,
        },
      ]);
      if (!confirm) {
        context.help({ error: true });
        return;
      }
    }
    const uri = await createCodeSandbox(
      deploy || path.resolve(codesandboxTemplatesDir, template),
    );
    console.log(chalk.yellow(`> created codesandbox ${uri}`));
  });

sandbox
  .command('build')
  .description('build and start a sandbox')
  .addArgument(
    new commander.Argument('<template>', 'template to use').choices(templates),
  )
  .argument('<destination>', 'build destination')
  .option('-w, --watch', 'build and watch fabric', true)
  .option(
    '--no-watch',
    'use this option if you have another process watching fabric',
  )
  .action((template, destination, { watch }) => {
    const templateDir = path.resolve(codesandboxTemplatesDir, template);
    fs.copySync(templateDir, destination, {
      filter: (src) => !ignore(templateDir, path.relative(templateDir, src)),
    });
    console.log(
      `${chalk.blue(
        `> building ${chalk.bold(template)} sandbox`,
      )} at ${chalk.cyanBright(destination)}`,
    );
    startSandbox(destination, watch, true);
  });

sandbox
  .command('start [path]')
  .description('start a sandbox')
  .addOption(
    new commander.Option(
      '-t, --template <template>',
      'template to use instead of a "path"',
    ).choices(templates),
  )
  .option('-w, --watch', 'build and watch fabric', true)
  .option(
    '--no-watch',
    'use this option if you have another process watching fabric',
  )
  .action(async (pathToSandbox, { template, watch }, context) => {
    if (!fs.existsSync(pathToSandbox) && templates.includes(pathToSandbox)) {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Did you mean to run ${chalk.blue(
            `npm run sandbox start -- -t ${pathToSandbox}\n`,
          )}?`,
          default: true,
        },
      ]);
      if (!confirm) {
        context.help({ error: true });
        return;
      }
      template = pathToSandbox;
      pathToSandbox = undefined;
    } else if (!fs.existsSync(pathToSandbox)) {
      console.log(chalk.blue('Did you mean to use the build command?'));
      context.help({ error: true });
      return;
    }
    startSandbox(
      pathToSandbox || path.resolve(codesandboxTemplatesDir, template),
      watch,
    );
  });

program.parse(process.argv);
