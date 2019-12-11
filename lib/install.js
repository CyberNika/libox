const path = require('path');
const { spawnSync } = require('child_process');

module.exports = (dir) => {
  spawnSync('npm', ['install'], {
    cwd: path.resolve(process.cwd(), dir),
    env: process.env,
    stdio: 'inherit',
  });
};
