'use strict';

var RouteRecognizer = require('route-recognizer');
var DataUtil = require('./DataUtil');

/**
 * Create route recognizer function
 *
 * @param {RouteDefinition} definition The RouteDefinition is simply an object
 *                                     with three properties:
 *                                     {
 *                                       path: string;
 *                                       name: string;
 *                                       children: RouteDefinition[];
 *                                     }
 *
 * @return {recognize} A recognize function that takes an url and
 *                     returns an object
 */
function createRecognizer(definition) {
  var router = new RouteRecognizer();
  var descriptions = DataUtil.generateDescriptions(definition);

  for (var i = 0; i < descriptions.length; i++) {
    router.add(descriptions[i]);
  }

  return function (url) {
    return DataUtil.buildState(router.recognize(url));
  };
}

module.exports = {
  createRecognizer: createRecognizer,
};
