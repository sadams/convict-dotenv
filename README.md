# convict dotenv

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Coverage Status](https://coveralls.io/repos/github/sadams/convict-dotenv/badge.svg)](https://coveralls.io/github/sadams/convict-dotenv)
[![npm version](https://badge.fury.io/js/convict-dotenv.svg)](https://badge.fury.io/js/convict-dotenv)

Small Node.js library for settings/configuration. It uses [dotenv](https://www.npmjs.com/package/dotenv) with [convict](https://www.npmjs.com/package/convict) to provide a simple interface for getting config from the environment, including `.env` files.

## usage

See [convict](https://www.npmjs.com/package/convict#user-content-usage) for building your schema and create a `.env` file in your project root (or elsewhere if you want to be explicit about it using an env var: `DOTENV_CONFIG_PATH`).

Example:

```javascript
const {getConfig} = require('convict-dotenv');
const schema = {
	foo: {
		env: 'FOO_EVAR',
		format: String,
		default: 'foodefault',
	},
};
console.log(getConfig(schema).foo);
```

If you want to only parse your config if a specific enabled flag is set in your config, specify the prop, and it will be evaluated before parsing the rest of the config. If it's falsey, only the flag and any other defaults you pass will be returned:

```javascript
const {getConfig} = require('convict-dotenv');
const schema = {
	enabled: {
		env: 'FOO_ENABLED',
		format: String,
		default: false,
	},
	somethingRequired: {
		env: 'FOO_REQUIRED',
		format: String,
		default: null, // <== convicts way of making something required...
	},
};
console.log(getConfig(schema, 'enabled', {theseAre: 'disabledDefaults'}));
/* 
No error thrown and results in:

{
  enabled: false, 
  theseAre: 'disabledDefaults'
}
*/

```

## Opinionated:

1. If your `NODE_ENV` is set to `test`, the default `.env` location `${process.cwd()}/.env`) will not be loaded (you have to explicitly set `DOTENV_CONFIG_PATH` if you want to load env vars from a file in tests: `DOTENV_CONFIG_PATH=/somewhere/test.env node index.js`). 
1. The global `process.env` shouldn't be changed by a library, which means not using [dotenv](https://www.npmjs.com/package/dotenv) package in it's standard setup: `require('dotenv').config()`.

## testing

Uses [tap](https://node-tap.org/docs/getting-started/).

Run `npm test`.


