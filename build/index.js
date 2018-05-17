const rollup = require('rollup').rollup;
const bundles = require('./bundles');
const configureRollup = require('./rollup.config');
const fs = require('fs-extra');

const config = require('./config');

const roll = (format, name, conf) => {
  rollup(
    configureRollup(conf.compress, conf.polyfills, conf.autoDefine)
  ).then(bundle => bundle
    .write({
      format,
      name: config.name,
      file: config.output + '/' + name + '.js'
    })
  );
}

if (fs.pathExistsSync('lib')) {
  fs.removeSync('lib')
}

for (const format in bundles) {
  roll(format.replace(/\d+/g, ''), format, bundles[format]);
}
