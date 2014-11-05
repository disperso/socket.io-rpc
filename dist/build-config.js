(function() {
  var config = {
    "paths": {
      "*": "*.js",
      "npm:*": "jspm_packages/npm/*.js",
      "github:*": "jspm_packages/github/*.js"
    },
    // any map config
    map: {
      "socket.io-client": "node_modules/socket.io-client/socket.io",
      "angular": "github:angular/bower-angular@^1.3.1"
    },
    "versions": {
      "github:angular/bower-angular": "1.3.1"
    }

    // etc. any SystemJS config
  };
  if (!module) {
    System.config(config);
  } else {
    module.exports = config;
  }
})();
