const path = require('path');
const fs = require('fs-extra');
const ejs = require('ejs');

const { ROOT } = require('../constants');

const templatesPath = path.resolve(ROOT, './templates');

const getTemplates = () => {
  const dirs = fs.readdirSync(templatesPath);

  return dirs.map((item) => ({
    name: item,
  }));
};

const getTemplatePath = (template) => path.resolve(templatesPath, template);

const getTemplateConfig = (template) => {
  const configPath = path.resolve(templatesPath, template, '.config/config.json');

  return fs.pathExistsSync(configPath) ? fs.readJsonSync(configPath) : {};
};

const generateProject = (template, target, data = {}) => {
  const render = (str) => {
    const result = ejs.render(str, data);
    return result;
  };

  const templatePath = getTemplatePath(template);

  fs.copySync(templatePath, target, {
    filter: (src) => path.basename(src) !== '.config',
  });

  const templateConfig = getTemplateConfig(template);

  const { ejsFiles = [] } = templateConfig;

  ejsFiles.forEach((item) => {
    const sourceFile = Array.isArray(item) ? item[0] : item;
    const targetFile = Array.isArray(item) ? render(item[1]) : item;

    const sourceFilePath = path.resolve(target, sourceFile);
    const targetFilePath = path.resolve(target, targetFile);

    const sourceFileContent = fs.readFileSync(sourceFilePath, 'utf8');

    fs.removeSync(sourceFilePath);

    fs.outputFileSync(targetFilePath, render(sourceFileContent));
  });
};

module.exports = {
  getTemplatePath,
  getTemplates,
  getTemplateConfig,
  generateProject,
};
