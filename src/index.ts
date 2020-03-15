#!/usr/bin/env node

import program from "commander";
import chalk from "chalk";

import init from "./lib/init";
import install from "./lib/install";

program
  .version(`libox ${require("../package.json").version}`)
  .usage("<command> [options]");

program
  .command("init [dir]")
  .description("init a project from templates")
  .option("-t, --template-dir <template-dir>", "模板目录")
  .action(async (dir, options) => {
    try {
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
    } catch (error) {
      console.log(chalk.red(error.message));
    }
  });

program.parse(process.argv);
