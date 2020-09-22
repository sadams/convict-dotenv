const fs = require('fs');
const path = require('path');

const dotenv = require('dotenv');
const convict = require('convict');

function getConfig(convictSchema) {
  let envVars;

  function defaultDotenvPath() {
    // Same as default from dotenv: https://www.npmjs.com/package/dotenv#path
    // (doesn't default because we do .parse() rather than .config()
    return path.resolve(process.cwd(), '.env');
  }

  function resolveDotenvPath() {
    // we don't want to accidentally use the default dotenv path in test mode, so we check
    // they have overridden the default using DOTENV_CONFIG_PATH
    // NB: `DOTENV_CONFIG_PATH` is the env var used in dotenv, but only works when using `.config()` (we use `.parse()`).
    const { NODE_ENV, DOTENV_CONFIG_PATH } = process.env;
    if (NODE_ENV === 'test') {
      return DOTENV_CONFIG_PATH;
    } else {
      return DOTENV_CONFIG_PATH || defaultDotenvPath();
    }
  }

  function loadEnvVars() {
    // we use `.parse()` instead of `.config()` to get env vars as object
    // (`.config()` modifies global process.env, which as are trying to avoid).
    const configPath = resolveDotenvPath();

    if (configPath && !envVars && fs.existsSync(configPath)) {
      envVars = dotenv.parse(fs.readFileSync(configPath));
    }
    return envVars;
  }

  const convictOptions = {
    // overrides using process.env (which we intentionally haven't modified, so wouldn't work).
    env: { ...loadEnvVars(), ...process.env },
  };

  const config = convict(convictSchema, convictOptions);
  config.validate({ allowed: 'strict' });
  return config.getProperties();
}

module.exports = {
  getConfig,
};
