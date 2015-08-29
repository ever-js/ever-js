var mongoClient = require("mongodb").MongoClient;

var MongoHandler = function(){
	var self = {};
  	var pub = {};
	
	self.createConnection = function(connectionString, cb) {
		mongoClient.connect( connectionString, function(err, db) {
			if (err) {
				self.dep.Logger.log(err);
				self.db = null;				
			} else {
				self.dep.Logger.log('Connection created');
				self.db = db;
				err = null;
			}
			cb(err, db, self.dep);
		});
  };  
  pub.connect = function(cb) {
	  if(self.db) {
		  self.dep.Logger.log("Using existing connection");
		  cb(null, self.db);
	  } else {
		  self.createConnection(GlobalConfig.connectionStrings.mongo, cb);
	  }
	  
  }
  
  pub.init = function(dependencies){
	  self.dep = dependencies;
	  self.dep.Logger.log("Initialzing Mongo Handler");
  }
  
  return pub;
};


module.exports = MongoHandler();
