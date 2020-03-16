import path from "path";
import ora from "ora";
import chalk from "chalk";

import { downloadTemplate, getTemplatePath } from "../utils/template";
import filters from "../utils/filters";
import { PROJECT_ROOT } from "../constants";

interface UpdateOptions {
  template?: string;
  templateDir?: string;
}

const update = async (options: UpdateOptions = {}) => {
  const { template, templateDir } = options;

  if (!template) return;

  let templatePath;

  // download template
  if (!templateDir) {
    console.log("");
    // download repo
    const downloadSpinner = ora(chalk.blueBright("下载模板")).start();
    await downloadTemplate(template);
    downloadSpinner.stop();
    console.log(chalk.blueBright(" ✔ 下载模板"));

    templatePath = getTemplatePath(template);
  } else {
    templatePath = getTemplatePath(template, path.resolve(templateDir));
  }

  const { update } = require(templatePath);

  update(PROJECT_ROOT, { filters });
};

export default update;
