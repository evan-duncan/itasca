const path = require('node:path');
const { cwd } = require('node:process');
const { walk } = require('@root/walk')

function Configuration() {};

Configuration.prototype.loadDefaults = function loadDefaults(version) {
  this.logLevel = 'error';
  this.port = process.env.PORT || 3000;
  this.controllersPath = path.join(cwd(), 'app/controllers');
};

module.exports = {
  async initialize() {
    const ENVIRONMENTS_PATH = path.join(cwd(), 'config/environments');
    const env = process.env.NODE_ENV || 'development';
    const config = new Configuration();

    // Load defaults
    require(path.join(cwd(), 'config/application.js'))(config);

    return walk(ENVIRONMENTS_PATH, (err, pathname, dirent) => {
      if (err) {
        return Promise.reject(err);
      }

      // Skip directories
      if (dirent.isDirectory() || dirent.name.startsWith(".")) {
        return Promise.resolve();
      }

      // Skip directories not for this env
      if (!dirent.name.startsWith(env)) {
        return Promise.resolve();
      }

      require(pathname)(config);
      return Promise.resolve();
    }).then(() => config);
  }
}
