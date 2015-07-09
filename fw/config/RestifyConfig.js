/**
 * Created by ruwang on 7/9/15.
 */
module.exports = {
  AppConfig : function(packageJson){
    return {
      name: packageJson.name,
      port : 8412 || process.env.RESTIFY_PORT,
      address : "0.0.0.0" || process.env.RESTIFY_LISTEN_IP,
    }
  },
  RestifyMiddleWareSet : function(restifyObject, serverObject) {
    return [
      restifyObject.acceptParser(serverObject.acceptable),
      restifyObject.gzipResponse(),
      restifyObject.queryParser(),
      restifyObject.bodyParser(),
    ]
  },
  RestifyPre : function(restifyObject, serverObject, userMiddlewareSet) {
    return [];
  }
}
