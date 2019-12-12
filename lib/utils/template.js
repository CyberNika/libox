const path = require('path');
const fs = require('fs-extra');
const ejs = require('ejs');
const download = require('download-git-repo');

const { TEMPLATES } = require('../constants');

const getTemplates = () => TEMPLATES;

const downloadTemplate = (template, dest) => {
  const { github } = getTemplates().find((item) => item.name === template);

  return new Promise((resolve, reject) => {
    download(github, dest, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const generateProject = async (template, dest, data = {}) => {
  const render = (str) => {
    const result = ejs.render(str, data);
    return result;
  };

  await downloadTemplate(template, dest);

  const templateConfig = require(`${dest}/.config/config.json`);

  const { ejsFiles = [] } = templateConfig;

  ejsFiles.forEach((item) => {
    const sourceFile = Array.isArray(item) ? item[0] : item;
    const targetFile = Array.isArray(item) ? render(item[1]) : item;

    const sourceFilePath = path.resolve(dest, sourceFile);
    const targetFilePath = path.resolve(dest, targetFile);

    const sourceFileContent = fs.readFileSync(sourceFilePath, 'utf8');

    fs.removeSync(sourceFilePath);

    fs.outputFileSync(targetFilePath, render(sourceFileContent));
  });

  fs.removeSync(path.resolve(dest, '.config'));
};

module.exports = {
  getTemplates,
  generateProject,
};
