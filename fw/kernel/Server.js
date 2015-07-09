var _   = require("lodash");
var restify   = require("restify");




  var config, userMiddleware, userRoutes, lib, server, packageJson, logger;
  var appConfig;
  var port, address;

  var init = function(dependencies) {

    logger = dependencies.Logger;
    packageJson = dependencies.PackageJson;
    config = dependencies.Config.RestifyConfig;
    userMiddleware = dependencies.User.Middleware;
    userRoutes = dependencies.User.Routes;
    lib = dependencies.Lib;
    appConfig = config.AppConfig(packageJson);
    port = appConfig.port;
    address = appConfig.address;

    logger("{init} Initializing server");
    server = restify.createServer(appConfig);
  }

  var setRestifyMiddleware = function() {
    logger("{setRestifyMiddleware} Setting Restify Middleware");
    var middlewareSet = config.RestifyMiddleWareSet(restify, server);
    if(!_.isEmpty(middlewareSet)) {
      _.forEach(middlewareSet,function(middleware){
        server.use(middleware);
      });
    }
  }

  var setRestifyPre = function() {
    logger("{setRestifyPre} Setting Restify Pre");
    var preSet = config.RestifyPre(restify, server, userMiddleware);
    if(!_.isEmpty(preSet)) {
      _.forEach(preSet,function(preFunction){
        server.pre(preFunction);
      });
    }
  }

  var setUserMiddleware = function(){
    logger("{setUserMiddleware} Setting User Middleware");
  }

  var startServer = function(dependencies) {
    init(dependencies);
    setRestifyMiddleware();
    setRestifyPre();
    setUserMiddleware();
    server.listen(port ,address, function(){
      logger("{startServer} "+server.name  + ' listening at '+ server.url);
    });
  }

module.exports =  {
  startServer : startServer
}