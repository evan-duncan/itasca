const { walk }  = require('@root/walk');

/**
 * Controllers will receive the router instance and define their own routing scheme.
 * The router loads controllers and injects the router
 **/
module.exports = {
  mount(path, app) {

    return walk(path, (err, pathname, dirent) => {
      if (err) {
        return Promise.reject(err);
      }

      // Skip directories
      if (dirent.isDirectory() || dirent.name.startsWith(".")) {
        return Promise.resolve();
      }

      require(pathname)(app);
      return Promise.resolve();
    }).then(() => app);
  }
}
