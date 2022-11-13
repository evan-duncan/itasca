const fs = require('node:fs/promises');
const path = require('node:path');
const process = require('node:process');
const util = require('node:util')
const exec = util.promisify(require('node:child_process').exec);
const pkg = require('../../package.json');

const application = `
module.exports = (config) => {
  // Initialize default for generated Itasca version
  config.loadDefaults('${pkg.version.split('.').filter((_, i) => i < 2).join('.')}');
};
`;

const development = `
module.exports = (config) => {
  config.logLevel = 'debug';
};
`;

const test = development;

const production = `
module.exports = (config) => {
  config.logLevel = 'error';
};
`

const index = `
const itasca = require('itasca');

itasca.run().catch(e => {
  console.error(e);
  process.exit(1);
});
`;

const readme = (name) => `
# ${name.charAt(0).toUpperCase() + name.slice(1)}
`;

const package = (name) => `
{
  "name": "${name}",
  "version": "0.0.1",
  "description": "A minimal MVC webframework for solo devs and productive teams",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "itasca": "${pkg.version}"
  }
}
`

const controller = `// Controllers export a function that takes a router instance as its only argument
module.exports = (router) => {
  router.get('/', (req, res) => res.send('hello world'));
};
`

exports.command = 'new [name]';
exports.description = 'Create a new Itasca project';
exports.handler = async (argv) => {
  if (!argv.name) {
    console.error('A name is required');
  } else {
    try {
      const cwd = path.resolve(process.cwd(), argv.name);
      await fs.mkdir(cwd);
      process.chdir(cwd);
      await fs.mkdir(path.join(cwd, 'config'));
      await fs.mkdir(path.join(cwd, 'config/environments'));
      await fs.mkdir(path.join(cwd, 'app/controllers'), { recursive: true });

      const files = [
        ['config/application.js', application],
        ['config/environments/development.js', development],
        ['config/environments/test.js', test],
        ['config/environments/production.js', production],
        ['index.js', index],
        ['README.md', readme(argv.name)],
        ['package.json', package(argv.name)],
        ['app/controllers/home.js', controller],
      ];

      await Promise.all(
        files.map(f =>
          fs.writeFile(path.join(cwd, f[0]), f[1])));

      await exec('npm install');
    } catch (e) {
      console.error(e);
    }
  }
}
