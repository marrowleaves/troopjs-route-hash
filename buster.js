/*globals module:false*/
/*eslint strict:0*/
module.exports["troopjs-route-hash"] = {
  "autoRun": false,

  "environment": "browser",

  "libs": [
    "bower_components/requirejs/require.js",
    "require.js"
  ],

  "resources": [
    "*.js",
    "test/**/*.js",
    "bower_components/troopjs-*/**/*.*",
    "bower_components/mu-*/**/*.*",
    "bower_components/requirejs/require.js",
    "bower_components/jquery/dist/jquery.js",
    "bower_components/when/**/*.js"
  ],

  "extensions": [ require("buster-amd") ],

  "buster-amd": {
    "pathMapper": function (path) {
      return path.replace(/\.js$/, "").replace(/^\//, "../");
    }
  },

  "tests": [
    "test/**/*-test.js"
  ]
};
