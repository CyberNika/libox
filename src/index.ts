#!/usr/bin/env node

import program from "commander";
import chalk from "chalk";

import init from "./lib/init";
import install from "./lib/install";
import update from "./lib/update";

program
  .version(`libox ${require("../package.json").version}`)
  .usage("<command> [options]");

program
  .command("init [dir]")
  .description("init a project from templates")
  .option("-T, --template-dir <template-dir>", "模板目录")
  .action(async (dir, options) => {
    const initOptions = {
      templateDir: options.templateDir,
    };

    await init(dir, initOptions);

    await install(dir);

    console.log("");
    console.log(chalk.blueBright("✅ 初始化完成\n"));
    if (dir) {
      console.log(chalk.yellow(`   $ cd ${dir}`));
    }
    console.log(chalk.yellow(`   $ npm start`));
    console.log("");
  });

program
  .command("update")
  .description("update project from the template")
  .requiredOption("-t, --template <template>", "模板")
  .option("-T, --template-dir <template-dir>", "模板目录")
  .action(async (options) => {
    const initOptions = {
      template: options.template,
      templateDir: options.templateDir,
    };

    await update(initOptions);

    console.log("");
    console.log(chalk.yellow(`   $ rm -fr node_modules package-lock.json`));
    console.log(chalk.yellow(`   $ npm i`));
    console.log(chalk.yellow(`   $ npm start`));
    console.log("");
  });

program.parse(process.argv);
