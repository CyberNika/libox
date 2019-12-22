const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');

const { getTemplates, generateProject } = require('./utils/template');
const { getUser, init } = require('./utils/git');

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

  const dest = path.resolve(process.cwd(), dir);

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
    default: path.basename(dest),
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

  const user = getUser();

  data.user = user.name || 'your-name';
  data.email = user.email || 'your-email';
  data.author = `${data.user} <${data.email}>`;

  fs.emptyDirSync(dest);

  await generateProject(template, dest, data);

  init(dest);
};
