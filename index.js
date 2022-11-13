require('dotenv').config();

const express = require('express');
const configuration = require('./src/configuration');
const controllers = require('./src/controllers');

module.exports = {
  async run() {
    const app = express();
    const config = await configuration.initialize();

    await controllers.mount(config.controllersPath, app);

    const server = app.listen(
      config.port,
      () => console.log(`App listening on port ${config.port}`)
    );

    return server;
  }
}
