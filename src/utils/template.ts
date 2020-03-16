import path from "path";
import fs from "fs-extra";
import yaml from "yaml";
import ejs from "ejs";
import chalk from "chalk";

import { clone } from "./git";
import { TEMPLATES, TEMPLATES_ROOT } from "../constants";

interface PromptChoice {
  name: string;
  value: string;
}

interface Prompt {
  name: string;
  type?: "input" | "number" | "confirm" | "list";
  when?: string;
  required?: boolean;
  message?: string;
  default?: string;
  choices: PromptChoice[];
  format?: string;
}

interface TemplateConfig {
  ejsFiles?: (string | [string, string])[];
  prompts?: Prompt[];
  filters?: { [key: string]: string };
}

const getTemplates = () => TEMPLATES;
const getTemplatePath = (template: string, root?: string) =>
  path.resolve(root || TEMPLATES_ROOT, template);
const getTemplateContentPath = (template: string, root?: string) =>
  path.resolve(root || TEMPLATES_ROOT, template, "template");

const downloadTemplate = (template: string) => {
  const templateData = getTemplates().find((item) => item.name === template);

  if (!templateData) return Promise.reject("模板不存在");

  return clone(templateData.github, path.join(TEMPLATES_ROOT, template));
};

const getTemplateConfig = (template: string, root?: string): TemplateConfig => {
  const templatePath = getTemplatePath(template, root);

  if (fs.existsSync(path.resolve(templatePath, "config.json"))) {
    return fs.readJSONSync(path.resolve(templatePath, "config.json"));
  }

  if (fs.existsSync(path.resolve(templatePath, "config.yml"))) {
    return yaml.parse(
      fs.readFileSync(path.resolve(templatePath, "config.yml"), "utf8")
    );
  }

  if (fs.existsSync(path.resolve(templatePath, "config.yaml"))) {
    return yaml.parse(
      fs.readFileSync(path.resolve(templatePath, "config.yaml"), "utf8")
    );
  }

  return {};
};

const generateProject = (
  dest: string,
  template: string,
  {
    context,
    templateRoot,
  }: {
    context?: { [key: string]: any };
    templateRoot?: string;
  } = {}
) => {
  console.log("");

  const render = (str: string) => {
    const result = ejs.render(str, context);
    return result;
  };

  fs.emptyDirSync(dest);

  console.log(chalk.blueBright(" ✔ 清空目录"));

  fs.copySync(getTemplateContentPath(template, templateRoot), dest);

  console.log(chalk.blueBright(" ✔ 拷贝模板"));

  const templateConfig = getTemplateConfig(template, templateRoot);

  const { ejsFiles = [] } = templateConfig;

  ejsFiles.forEach((item) => {
    const sourceFile = Array.isArray(item) ? item[0] : item;
    const targetFile = Array.isArray(item) ? render(item[1]) : item;

    const sourceFilePath = path.resolve(dest, sourceFile);
    const targetFilePath = path.resolve(dest, targetFile);

    const sourceFileContent = fs.readFileSync(sourceFilePath, "utf8");

    fs.removeSync(sourceFilePath);

    fs.outputFileSync(targetFilePath, render(sourceFileContent));
  });

  console.log(chalk.blueBright(" ✔ 解析模板"));
};

export {
  getTemplates,
  downloadTemplate,
  getTemplateConfig,
  generateProject,
  getTemplatePath,
};
