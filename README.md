# @jitsusama/logging-js

![last commit badge](https://img.shields.io/github/last-commit/jitsusama/logging-js)
![package.json version badge](https://img.shields.io/github/package-json/v/jitsusama/logging-js)
[![license badge](https://img.shields.io/npm/l/@jitsusama/logging-js)](./LICENSE)
![vulnerabilities badge](https://img.shields.io/snyk/vulnerabilities/npm/@jitsusama/logging-js)

This is a very simple logging library that handles Node.JS or browser apps. Its use cases are rather limited and are
currently documented in this repository's [json.js](lib/json.js) and [text.js](lib/text.js) files.

## Installation

You can install this module via [NPM](https://npmjs.com/package/@jitsusama/logging-js)
with `npm install @jitsusama/logging-js`.

## Usage

```javascript
const logging = require("@jitsusama/logging-js");
const logger = logging.getLogger("some.name");
logger.info("hello %s", "world");
```

The usage above will default to simplified text output when imported by a website bundler, or as a JSON string when
imported from a Node.JS application.

You can override the default output handling by specifically importing the type you wish:

```javascript
const textLogging = require("@jitsusama/logging-js/lib/text.js");
const jsonLogging = require("@jitsusama/logging-js/lib/json.js");
```

## Contributing

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in
this project you agree to abide by its terms.
