/**
 * Created by ruwang on 7/9/15.
 */
module.exports = {
  AppConfig : function(dependencies){
    return {
      name: dependencies.packageJson.name,
      port : 8312 || process.env.RESTIFY_PORT,
      address : "0.0.0.0" || process.env.RESTIFY_LISTEN_IP
    }
  },
  RestifyMiddleWareSet : function(dependencies) {
    return [
      dependencies.restifyObject.acceptParser(dependencies.serverObject.acceptable),
      dependencies.restifyObject.gzipResponse(),
      dependencies.restifyObject.queryParser(),
      dependencies.restifyObject.bodyParser()
    ]
  },
  RestifyPre : function(dependencies) {
    return [];
  }
}
