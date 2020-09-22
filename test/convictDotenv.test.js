const tap = require('tap');

const { getConfig } = require('../');

const schema = {
  foo: {
    env: 'FOO_EVAR',
    format: String,
    default: 'foodefault',
  },
  bar: {
    env: 'BAR_EVAR',
    format: String,
    default: 'bardefault',
  },
};

tap.test('should parse from env', async (t) => {
  process.env.FOO_EVAR = 'bar';
  t.equal(getConfig(schema).foo, 'bar');
  delete process.env.FOO_EVAR;
});

tap.test('should parse from specific env file (not test env)', async (t) => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.DOTENV_CONFIG_PATH = `${__dirname}/test.env`;
  process.env.NODE_ENV = 'nottest';
  t.equal(getConfig(schema).foo, 'frmspecificfile');
  delete process.env.DOTENV_CONFIG_PATH;
  process.env.NODE_ENV = originalNodeEnv;
});

tap.test('should parse from specific env file (test env)', async (t) => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.DOTENV_CONFIG_PATH = `${__dirname}/test.env`;
  process.env.NODE_ENV = 'test';
  t.equal(getConfig(schema).foo, 'frmspecificfile');
  delete process.env.DOTENV_CONFIG_PATH;
  process.env.NODE_ENV = originalNodeEnv;
});

tap.test('should not parse from root file (test env)', async (t) => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'test';
  delete process.env.DOTENV_CONFIG_PATH;
  t.equal(getConfig(schema).foo, 'foodefault');
  process.env.NODE_ENV = originalNodeEnv;
});

tap.test('should parse from root file (non test env)', async (t) => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'nottest';
  delete process.env.DOTENV_CONFIG_PATH;
  t.equal(getConfig(schema).foo, 'frmfileinrootdotenv');
  delete process.env.DOTENV_CONFIG_PATH;
  process.env.NODE_ENV = originalNodeEnv;
});

tap.test('should parse from default', async (t) => {
  t.equal(getConfig(schema).bar, 'bardefault');
});
