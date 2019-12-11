const { fork } = require('child_process');

const { DOCZ_BIN, LIBOX_ROOT } = require('./constants');

module.exports = () => {
  require('./prepare')();

  fork(DOCZ_BIN, ['dev'], {
    cwd: LIBOX_ROOT,
    env: process.env,
    stdio: 'inherit',
  });
};
