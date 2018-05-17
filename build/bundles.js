module.exports = exports = {
  cjs: {
    polyfills: {
      arrows: true,
      async: true,
      spread: true
    }
  },
  es6: {
    polyfills: {
      async: true,
      spread: true
    }
  },
  es7: {
    polyfills: {
      spread: true
    }
  },
  iife: {
    compress: true,
    polyfills: {
      arrows: true,
      assign: true,
      async: true,
      promise: true,
      spread: true
    }
  },
  umd: {
    compress: true,
    polyfills: {
      async: true,
      arrows: true,
      spread: true
    }
  }
};
