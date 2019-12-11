const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const { execSync } = require('child_process');

const { getTemplates, generateProject } = require('./utils/template');

module.exports = async (dir) => {
  if (!dir) {
    const { yes } = await inquirer.prompt([{
      name: 'yes',
      type: 'confirm',
      message: '确定初始化在当前目录吗？这将清空当前目录。',
    }]);

    if (!yes) return;
  } else if (fs.existsSync(dir)) {
    const { yes } = await inquirer.prompt([{
      name: 'yes',
      type: 'confirm',
      message: '目录不为空，是否继续？这将清空该目录。',
    }]);

    if (!yes) return;
  }

  const targetDir = path.resolve(process.cwd(), dir);

  const templates = getTemplates().map((item) => ({ ...item, value: item.name }));

  const { template, name } = await inquirer.prompt([{
    name: 'template',
    type: 'list',
    message: '选择一个模板',
    choices: templates,
    default: templates[0],
  }, {
    name: 'name',
    type: 'input',
    message: '项目名',
    default: path.basename(targetDir),
  }]);

  let data = {};

  if (template === 'react-component') {
    const { componentName } = await inquirer.prompt([{
      name: 'componentName',
      type: 'input',
      message: '组件名称',
      default: name
        .replace(/-(\S)/g, (_, $1) => $1.toUpperCase())
        .replace(/^(\w)/g, (_, $1) => $1.toUpperCase()),
    }]);

    const { description } = await inquirer.prompt([{
      name: 'description',
      type: 'input',
      message: '描述',
      default: `适用于 React 的 ${componentName} 组件。`,
    }]);

    data = {
      name,
      componentName,
      description,
    };
  }

  const { author } = await inquirer.prompt([{
    name: 'author',
    type: 'input',
    message: '作者',
    default: 'your-name <your-email>',
  }]);

  data.author = author || '';
  [data.user] = data.author.split(' ');

  fs.emptyDirSync(targetDir);

  execSync('git init && gitmoji -i', {
    cwd: path.resolve(process.cwd(), dir),
  });

  generateProject(template, targetDir, data);
};
