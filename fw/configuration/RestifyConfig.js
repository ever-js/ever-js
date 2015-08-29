'use strict'
/**
 * Created by ruwang on 7/9/15.
 */
module.exports = {
  AuthFunction : function(dependencies){
    /*Add the authentication function as shown below
     dependencies.filters.<Authentication Filter Module name>.<function name>

     eg:
     dependencies.filters.Auth.validateAuthHeader

     if there are no Auth function,
     return false;
     */
   return dependencies.filters.SampleFilters.sampleAuthFilter;
  },
  AppConfig : function(dependencies){

    return {
    /*
     ADD more restify create server parameters,

     eg:
       certificate: ...,
       key: ...,

       */
      name: dependencies.packageJson.name,
      port : GlobalConfig.Common.port,
      address : GlobalConfig.Common.address
    }
  },
  RestifyMiddlewareSet : function(dependencies) {
    return [
        /*
        Add more restify modules
         */
      dependencies.restifyObject.acceptParser(dependencies.serverObject.acceptable),
      dependencies.restifyObject.authorizationParser(),
      dependencies.restifyObject.gzipResponse(),
      dependencies.restifyObject.queryParser(),
      dependencies.restifyObject.bodyParser()
    ]
  },
  RestifyPre : function(dependencies) {
    return [
        /*
        Add Restify pre() functions
         */
    ];
  }
}
