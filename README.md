# Itasca

A simple MVC framework to be productive.

Itasca is an express library designed to focus on writing your app and not worrying about the app structure. Itasca embraces convention over configuration.

# Getting Started

## Usage

Your entrypoint file can tell itasca to run.
``` javascript
// index.js
const itasca = require('itasca');

itasca.run().catch(e => {
  console.error(e);
  process.exit(1);
});
```

You application should have a `config/application.js`, and `config/environments/{development, test, production}.js`.
These files will serve as the main configuration for itasca. If you do not include them defaults will be used.

``` javascript
// config/application.js

module.exports = (config) => {
  // Initialize defaults for generated Itasca version
  config.loadDefaults('0.1');
  
  // Settings in config/environments/* take precedence over those specified here.
}
```

``` javascript
// config/environments/development.js

module.exports = (config) => {
  config.logLevel = 'debug';
}
```

## CLI

# License

MIT &copy; 2022 Evan Duncan
