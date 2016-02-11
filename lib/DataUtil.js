'use strict';

/**
 * Create a shallow copy of provided object, will only use keys returned by
 * "Object.keys".
 *
 * @param {Object|null} input Object to copy
 *
 * @return {Object|null} A shallow copy of provided object, if input null,
 *                       return null.
 */
function _shallowCopyObj(input) {
  if (input === null) {
    return null;
  }

  var copy = {};
  var keys = Object.keys(input);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    copy[key] = input[key];
  }

  return copy;
}

/**
 * Generate route description for route-recognizer
 *
 * @param {RouteDefinition} definition
 *
 * @return {Object[][]} The base object should look like:
 *                      {
 *                        path: string;
 *                        handler: string;
 *                      }
 */
function generateDescriptions(definition) {
  var path = definition.path;
  var name = definition.name;
  var children = definition.children;

  var current = [{ path: path, handler: name }];
  var results = [];

  if (!children || !children.length) {
    return [ current ];
  }

  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var parts = generateDescriptions(child);
    for (var j = 0; j < parts.length; j++) {
      results.push(current.concat(parts[j]));
    }
  }

  return results;
}

/**
 * Take route segments returned from "routeRecognizer.recongnize" and convert
 * them into a single object
 *
 * @param  {Object} parts Array like structure returned by
 *                        "routeRecognizer.recongnize"
 *
 * @return {Object} Should look like:
 *                  {
 *                    "root": {
 *                      "user": {
 *                        "id": "123",
 *                        "profile": {}
 *                      }
 *                    },
 *                    "queryParams": {
 *                      "q": "abc"
 *                    }
 *                  }
 */
function buildState(parts) {
  var obj = {};
  var cur = obj;

  for (var i = 0; i < parts.length; i++) {
    var name = parts[i].handler;
    var params = parts[i].params;
    cur[name] = _shallowCopyObj(params);
    cur = cur[name];
  }

  obj.queryParams = parts.queryParams;

  return obj;
}

module.exports = {
  _shallowCopyObj: _shallowCopyObj,
  generateDescriptions: generateDescriptions,
  buildState: buildState,
};
