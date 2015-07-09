var _   = require("lodash");
var restify   = require("restify");
var config;
var userMiddleware;
var userFilters;
var userRoutes;
var server;
var packageJson;
var logger;
var appConfig;
var port, address;
var authFunction;

var init = function(dependencies) {
  //Initialising basic variables.
  logger = dependencies.Logger;
  packageJson = dependencies.PackageJson;
  userMiddleware = dependencies.User.Middleware;
  userFilters  =  dependencies.User.Filters;
  userRoutes = dependencies.User.Routes;

  //Initialising config based values
  config = dependencies.Config.RestifyConfig;
  appConfig = config.AppConfig({packageJson:packageJson});

  port = appConfig.port;
  address = appConfig.address;

  //Do u need authentication bro !!
  authFunction = config.AuthFunction({
   filters : userFilters
  })

  //Ok Lets start the server
  logger("{init} Initializing server");
  server = restify.createServer(appConfig);
}

var setRestifyMiddleware = function() {
  logger("{setRestifyMiddleware} Setting Restify Middleware");
  var middlewareSet = config.RestifyMiddlewareSet({
    restifyObject: restify,
    serverObject: server
  });
  if(!_.isEmpty(middlewareSet)) {
    _.forEach(middlewareSet,function(middleware){
      server.use(middleware);
    });
  }
}

var setRestifyPre = function() {
  logger("{setRestifyPre} Setting Restify Pre");
  var preSet = config.RestifyPre({
    restifyObject: restify,
    serverObject: server,
    userMiddleware : userMiddleware,
    filters : userFilters
  });
  if(!_.isEmpty(preSet)) {
    _.forEach(preSet,function(preFunction){
      server.pre(preFunction);
    });
  }
}

var setUserMiddleware = function(){
  logger("{setUserMiddleware} Setting User Middleware");

  _.forEach(userRoutes, function(routes, key){
    switch(key) {
      case "GET" :
            if(!_.isEmpty(routes)){
              _.forEach(routes,function(route){
                server.get(route.config, buildUserMiddlewareChain(route));
              });
            }
            break;
      case "POST" :
        if(!_.isEmpty(routes)){
          _.forEach(routes,function(route){
            server.post(route.config, buildUserMiddlewareChain(route));
          });
        }
        break;
      case "PUT" :
        if(!_.isEmpty(routes)){
          _.forEach(routes,function(route){
            server.put(route.config, buildUserMiddlewareChain(route));
          });
        }
        break;
      case "DELETE" :
        if(!_.isEmpty(routes)){
          _.forEach(routes,function(route){
            server.del(route.config, buildUserMiddlewareChain(route));
          });
        }
        break;
    }
  })
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

var buildUserMiddlewareChain = function(route) {
  var mwChain = [];

  //Check for valid configs
  if(_.isEmpty(route.config) || !route.config.path) {
    throw("There are invalid routes. Please check again.");
  } else {

    //Load the authentication function
    if (route.config.isSecure) {
      if (authFunction && _.isFunction(authFunction)) {
        mwChain.push(authFunction);
      } else {
        throw("Invalid authentication function !!\nPlease add a valid authentication function !!");
      }
    }
    //Load the filters if available
    if (!_.isEmpty(route.filters)) {
      _.forEach(route.filters, function (filter) {
        if (filter && _.isFunction(filter)) {
          mwChain.push(filter);
        } else {
          throw("Invalid Filter at : " + route.config.path)
        }
      });
    }

    //Finally, load the middleware
    if (route.method && _.isFunction(route.method)) {
      mwChain.push(route.method);
    } else {
      throw("Invalid user defined middleware : " + route.config.path);
    }
  }

  return mwChain;
}
module.exports =  {
  startServer : startServer
}