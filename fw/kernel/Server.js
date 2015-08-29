'use restric'
var _   = require("lodash");
var restify   = require("restify");


var everJsServer = function() {

  var self = {};
  var pub = {};

  self.logger = null;
  self.packageJson = null;
  self.userMiddleware = null;
  self.userFilters  =  null;
  self.userRoutes = null

  //Initialising config based values
  self.config = null;
  self.appConfig = null;

  self.port = null;
  self.address = null;

  //Do u need authentication bro !!
  self.authFunction = null;


  //Ok Lets start the server
  self.logger = null;
  self.server = null;

  self.init = function(dependencies) {
    //Initialising basic variables.
    self.logger = dependencies.Logger;
    self.packageJson = dependencies.PackageJson;
    self.userMiddleware = dependencies.User.Middleware;
    self.userFilters  =  dependencies.User.Filters;
    self.userRoutes = dependencies.User.Routes;

    //Initialising config based values
    self.config = dependencies.Config.RestifyConfig;
    self.appConfig = self.config.AppConfig({packageJson:self.packageJson});

    self.port = self.appConfig.port;
    self.address = self.appConfig.address;

    self.authFunction = self.config.AuthFunction({
      filters : self.userFilters
    })

    //Ok Lets start the server
    self.logger("{init} Initializing server");
    self.server = restify.createServer(self.appConfig);
  }

  self.setRestifyMiddleware = function() {
    self.logger("{setRestifyMiddleware} Setting Restify Middleware");
    var middlewareSet = self.config.RestifyMiddlewareSet({
      restifyObject: restify,
      serverObject: self.server
    });
    if(!_.isEmpty(middlewareSet)) {
      _.forEach(middlewareSet,function(middleware){
        self.server.use(middleware);
      });
    }
  }

  self.setRestifyPre = function() {
    self.logger("{setRestifyPre} Setting Restify Pre");
    var preSet = self.config.RestifyPre({
      restifyObject: restify,
      serverObject: self.server,
      userMiddleware : self.userMiddleware,
      filters : self.userFilters
    });
    if(!_.isEmpty(preSet)) {
      _.forEach(preSet,function(preFunction){
        self.server.pre(preFunction);
      });
    }
  }

  self.setUserMiddleware = function(){
    self.logger("{setUserMiddleware} Setting User Middleware");

    _.forEach(self.userRoutes, function(routes, key){
      switch(key) {
        case "GET" :
          self.setRoutes("get", routes);
          break;
        case "POST" :
          self.setRoutes("post", routes);
          break;
        case "PUT" :
          self.setRoutes("put", routes);
          break;
        case "DELETE" :
          self.setRoutes("del", routes);
          break;
      }
    });
  }

  self.setRoutes = function(serverFunctionName, routes) {
    if(!_.isEmpty(routes)){
      _.forEach(routes,function(route){
        self.server[serverFunctionName](route.config, self.buildUserMiddlewareChain(route));
      });
    }
  }

  self.buildUserMiddlewareChain = function(route) {
    var mwChain = [];

    //Check for valid configs
    if(_.isEmpty(route.config) || !route.config.path) {
      throw("There are invalid routes. Please check again.");
    } else {

      //Load the authentication function
      if (route.config.isSecure) {
        if (self.authFunction && _.isFunction(self.authFunction)) {
          mwChain.push(self.authFunction);
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

  pub.startServer = function(dependencies) {
    self.init(dependencies);
    self.setRestifyMiddleware();
    self.setRestifyPre();
    self.setUserMiddleware();
    self.server.listen(self.port ,self.address, function() {
      self.logger("------------------------------");
      self.logger("{startServer} " + self.server.name  + ' listening at '+ self.server.url);
      self.logger("------------------------------");
    });
  }
  
  return pub;

}

module.exports =  everJsServer();