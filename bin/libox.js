#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');

program
  .version(`libox ${require('../package.json').version}`)
  .usage('<command> [options]');

// program
//   .command('dev')
//   .description('start a dev server')
//   .action(() => {
//     require('../lib/dev')()
//   })

program
  .command('init [dir] [options]')
  .description('init a project from templates')
  .action(async (dir = '', options) => {
    await require('../lib/init')(dir, options);

    /* eslint-disable no-console */
    console.log('\n');
    console.log(chalk.yellow('  项目初始化完成，开始安装依赖'));
    console.log('\n');
    /* eslint-disable no-console */

    require('../lib/install')(dir, options);
  });

program.parse(process.argv);
