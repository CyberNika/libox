const { execSync } = require('child_process');

const init = (dest) => {
  execSync('git init && npx gitmoji -i', {
    cwd: dest,
  });
};

const getUser = () => {
  const name = execSync('git config user.name').toString().replace('\n', '');
  const email = execSync('git config user.email').toString().replace('\n', '');

  return {
    name,
    email,
  };
};

module.exports = {
  init,
  getUser,
};
