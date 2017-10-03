/* eslint-disable import/no-extraneous-dependencies, no-extend-native, func-names, prefer-rest-params, global-require, max-len */

if (typeof Promise === 'undefined') {
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js'); // eslint-disable-line no-undef
}

// Edge breaks .call so this is needed: https://github.com/Microsoft/ChakraCore/issues/1415
// Adding this here to prevent this bug and future potential bugs
Function.prototype.call = function(t) {
  return this.apply(t, Array.prototype.slice.apply(arguments, [1]));
};



// These core-js polyfills somehow convince React not to process the DefinePlugin call to change
// process.env.NODE_ENV to 'production'
//
// I'm testing this by running
//  yarn build | grep react
//
// With these commented out, you will see production builds
// If you uncomment these, the production builds will go away (wtf?!)
//
// Summoning the great SeanLarkin powers to debug

//require('core-js/fn/object');
//require('core-js/fn/number');
//require('core-js/fn/array');
//require('core-js/es6/symbol');
//require('core-js/es6/string'); // this breaks react-dom.production
require('whatwg-fetch');

