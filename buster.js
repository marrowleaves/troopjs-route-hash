module.exports["troopjs-route-hash"] = {
    "autoRun": false,
    "environment": "browser",
    "rootPath": "./",
    "libs": [
        "bower_components/requirejs/require.js",
        "require.js"
    ],
    "sources": [
        "**/*.js"
    ],
    "extensions": [require("buster-amd")],
    "buster-amd": {
        pathMapper: function (path) {
          return path.replace(/\.js$/, "").replace(/^\//, "../");
        }
    },
    "tests": [
        "test/**/*-test.js",
    ]
};
