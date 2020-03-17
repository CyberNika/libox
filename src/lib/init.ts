import fs from "fs-extra";
import path from "path";
import { prompt } from "inquirer";
import ora from "ora";
import chalk from "chalk";

import {
  getTemplates,
  downloadTemplate,
  getTemplateConfig,
  generateProject,
} from "../utils/template";
import filters, { parse } from "../utils/filters";
import { getUser, init as gitInit } from "../utils/git";

interface InitOptions {
  templateDir?: string;
}

const init = async (dir = "", options: InitOptions = {}) => {
  if (!dir) {
    const { yes } = await prompt([
      {
        name: "yes",
        type: "confirm",
        message: "确定初始化在当前目录吗？这将清空当前目录。",
      },
    ]);

    if (!yes) return;
  } else if (fs.existsSync(dir)) {
    const { yes } = await prompt([
      {
        name: "yes",
        type: "confirm",
        message: "目录不为空，是否继续？这将清空该目录。",
      },
    ]);

    if (!yes) return;
  }

  const defaultUser = getUser();

  const dest = path.resolve(process.cwd(), dir);
  const templates = getTemplates().map((item) => ({
    ...item,
    value: item.name,
  }));

  const { template } = await prompt([
    {
      name: "template",
      type: "list",
      message: "选择一个模板",
      choices: templates,
      default: templates[0],
    },
  ]);
  const context: {
    basename: string;
    template: string;
    defaultUser: typeof defaultUser;
    [key: string]: any;
  } = {
    basename: path.basename(dest),
    defaultUser,
    template,
  };
  let templateConfig;

  // download template
  if (!options.templateDir) {
    console.log("");
    // download repo
    const downloadSpinner = ora(chalk.blueBright("下载模板")).start();
    await downloadTemplate(template);
    downloadSpinner.stop();
    console.log(chalk.blueBright(" ✔ 下载模板"));

    templateConfig = getTemplateConfig(template);
  } else {
    templateConfig = getTemplateConfig(
      template,
      path.resolve(options.templateDir)
    );
  }

  // parse prompts
  if (templateConfig.prompts) {
    for (const option of templateConfig.prompts) {
      const result = await prompt([
        {
          name: option.name,
          type: option.type,
          message: option.message ? parse(option.message, context) : undefined,
          choices: option.choices,
          default: option.default ? parse(option.default, context) : undefined,
        },
      ]);

      if (option.format) {
        const filter = filters[option.format as keyof typeof filters];
        context[option.name] = filter
          ? filter(result[option.name] as any)
          : result[option.name];
      } else {
        context[option.name] = result[option.name] as any;
      }
    }
  }

  // generate project
  generateProject(dest, template, {
    context,
    templateRoot: options.templateDir,
  });

  // git init
  gitInit(dest);
};

export default init;
