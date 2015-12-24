/**
 * To build/bundle the files, install browserify globally,
 * do 'npm install' in the vis vendor directory,
 * then run the following command in this directory
 *   browserify timeline-build.js -o vis-custom.js -s vis -x moment
 * Then delete node_modules in the vis vendor directory so it's
 * not accidentally committed.
 */

exports.DataSet  = require('../../../vendors/vis/lib/DataSet');
exports.Timeline = require('../../../vendors/vis/lib/timeline/Timeline');
exports.Graph2d = require('../../../vendors/vis/lib/timeline/Graph2d');