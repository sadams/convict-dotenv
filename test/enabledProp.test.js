const tap = require('tap');

const { getConfig } = require('../');

const schema = {
  myEnabledFlag: {
    env: 'FOO_ENABLED',
    format: Boolean,
    default: false,
  },
  somethingRequired: {
    env: 'BAR_REQUIRED',
    format: String,
    default: null,
  },
};

tap.test('should ignore schema if disable prop resolves to falsey', async (t) => {
  const conf = getConfig(schema, 'myEnabledFlag', { whatevr: 'uwant' });
  console.log(conf);
  t.same(conf, {
    myEnabledFlag: false,
    whatevr: 'uwant',
  });
});

tap.test('should behave as normal if disable prop resolves to truthy', async (t) => {
  process.env.FOO_ENABLED = 'true';
  t.throws(() => {
    getConfig(schema, 'myEnabledFlag', { whatevr: 'uwant' });
  }, /somethingRequired: must be of type String/);
  delete process.env.FOO_ENABLED;
});

tap.test("should error if disable prop isn't in schema", async (t) => {
  process.env.FOO_ENABLED = 'true';
  t.throws(() => {
    getConfig(schema, 'WRONG');
  }, /Convict schema doesn't include property "WRONG"\. Remove enabledProp argument or include it in the schema\./);
  delete process.env.FOO_ENABLED;
});
