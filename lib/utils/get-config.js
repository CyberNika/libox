const path = require('path');
const fs = require('fs-extra');

const { getTemplateConfig } = require('./template');
const { PROJECT_ROOT } = require('../constants');

const userConfigPath = path.resolve(PROJECT_ROOT, 'libox.config.js');

const getConfig = () => {
  if (fs.pathExistsSync(userConfigPath)) {
    const userConfig = require(userConfigPath);

    if (typeof userConfig === 'function') {
      return userConfig();
    }

    return userConfig;
  }

  return {};
};

const pickConfig = (keys = []) => {
  const userConfig = getConfig();

  return keys.reduce((acc, key) => {
    if (userConfig[key]) {
      acc[key] = userConfig[key];
    }

    return acc;
  }, {});
};

const getDoczConfig = (template) => {
  const doczKeys = ['title', 'menu'];

  const templateDoczConfig = template ? getTemplateConfig(template).docz : {};
  const userDoczConfig = pickConfig(doczKeys);

  return { ...templateDoczConfig, ...userDoczConfig };
};

module.exports = {
  pickConfig,
  getConfig,
  getDoczConfig,
};
