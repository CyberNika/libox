const path = require('path');
const fs = require('fs-extra');

const { PROJECT_ROOT, LIBOX_ROOT } = require('./constants');
const { getDoczConfig, pickConfig } = require('./utils/get-config');
const { getTemplatePath } = require('./utils/template');

const symlinks = [
  'docs', 'src', '.eslintrc.js',
  '.eslintignore', 'tsconfig.json',
  '.prettierrc', 'package.json',
];

module.exports = () => {
  fs.emptyDirSync(LIBOX_ROOT);

  symlinks.forEach((item) => {
    const source = path.resolve(PROJECT_ROOT, item);

    if (fs.pathExistsSync(source)) {
      fs.ensureSymlinkSync(source, path.resolve(LIBOX_ROOT, item));
    }
  });

  const projectTemplate = pickConfig(['template']).template || 'react-component';

  fs.writeJSONSync(path.resolve(LIBOX_ROOT, 'docz.json'), getDoczConfig(projectTemplate), { spaces: 2 });

  const templateConfigPath = path.resolve(getTemplatePath(projectTemplate), '.config');

  fs.copySync(path.resolve(templateConfigPath, 'gatsby-browser.js'), path.resolve(path.resolve(LIBOX_ROOT, 'gatsby-browser.js')));
  fs.copySync(path.resolve(templateConfigPath, 'gatsby-config.js'), path.resolve(path.resolve(LIBOX_ROOT, 'gatsby-config.js')));
  fs.copySync(path.resolve(templateConfigPath, 'gatsby-node.js'), path.resolve(path.resolve(LIBOX_ROOT, 'gatsby-node.js')));
};
