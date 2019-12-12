const path = require('path');

const ROOT = path.resolve(__dirname, '../../');
const DOCZ_BIN = path.resolve(ROOT, 'node_modules/docz/bin/index.js');
const PROJECT_ROOT = process.cwd();
const LIBOX_ROOT = path.resolve(PROJECT_ROOT, '.libox');

const TEMPLATES = require('../../templates.json');

module.exports = {
  ROOT,
  DOCZ_BIN,
  PROJECT_ROOT,
  LIBOX_ROOT,

  TEMPLATES,
};
