# Node Socket Seed

A starting point for basic Node.js/Express.js applications that use Socket.io and a simple Express API

[![Build Status](https://travis-ci.org/nafeu/node-socket-seed.svg?branch=master)](https://travis-ci.org/nafeu/node-socket-seed)

### Requirements

Node.js v7 or higher

### Features

- `mocha` tests with `chai-http` for API and socket.io interaction testing
- a config page served at `/config` to easily modify config variables when in dev mode
- starter `styles.css` with cross-browser recommended fixes from [html5-boilerplate](https://github.com/h5bp/html5-boilerplate)

### Installation

```
git clone https://github.com/nafeu/node-socket-seed.git <PROJECT NAME>
cd <PROJECT NAME>
npm install
```

### Development / Basic Usage

```
npm install -g nodemon
cp sample-config.js config.js
nodemon server.js
```

If you don't want to use [`nodemon`](https://github.com/remy/nodemon) you can also just run `node server.js` and omit the `nodemon` installation.

Go to `http://localhost:8000/` in a web browser.

#### Running Tests

Use `npm test`

### Credits

Nafeu Nasir

### License

MIT