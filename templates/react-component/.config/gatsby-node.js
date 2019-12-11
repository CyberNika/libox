const path = require('path');

module.exports ={
  onCreateWebpackConfig: (args) => {
    args.actions.setWebpackConfig({
      resolve: {
        // ⚠ Note the '..' in the path because the docz gatsby project lives in the `.docz` directory
        modules: [path.resolve(__dirname, '../src'), 'node_modules'],
        alias: {
          docs: path.resolve(__dirname, '../docs'),
          examples: path.resolve(__dirname, '../examples'),
          components: path.resolve(__dirname, '../src/components'),
          src: path.resolve(__dirname, '../src'),
        },
      },
    });
  }
};
