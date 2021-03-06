<img width="100%"  src="http://ever-js.github.io/img/backgw.png">
<sup>powered by</sup> <img width="25%"  src="https://www.mongodb.org/static/images/mongodb-logo-large.png">


[![Gitter](https://img.shields.io/badge/gitter-join_chat-blue.svg)](https://gitter.im/ever-js/ever?utm_source=badge)
[![Issues](https://img.shields.io/github/issues/ever-js/ever-js.svg)](http://ever-js.github.io/)
[![bitHound Score](https://www.bithound.io/github/ever-js/ever-js/badges/score.svg)](https://www.bithound.io/github/ever-js/ever-js)
[![Code Climate](https://codeclimate.com/repos/55c45927e30ba04632001dd2/badges/32dd7d031c0bb7e707f7/gpa.svg)](https://codeclimate.com/repos/55c45927e30ba04632001dd2/feed)

Enjoyment Via Easiness of Restify - js
======================


[![npm package](https://nodei.co/npm/ever-js.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ever-js/)

---
### This framework is completely based on **[Restify](http://mcavage.me/node-restify/)**.

---
* **[Installing the ever-js](https://github.com/ever-js/ever-js/blob/master/README.md#installing-the-framework)**
* **[Folder structure](https://github.com/ever-js/ever-js/blob/master/README.md#folder-structure)**
* **[Global Variables](https://github.com/ever-js/ever-js/blob/master/README.md#global-variables)**
* **[Handlers](https://github.com/ever-js/ever-js/blob/master/README.md#handlers)**
* **[Routes](https://github.com/ever-js/ever-js/blob/master/README.md#routes)**
* **[Library](https://github.com/ever-js/ever-js/blob/master/README.md#lib)**
* **[Configuration](https://github.com/ever-js/ever-js/blob/master/README.md#config)**
* **[User Filters](https://github.com/ever-js/ever-js/blob/master/README.md#filters)**
* **[User Middleware](https://github.com/ever-js/ever-js/blob/master/README.md#middleware)**
* **[Kernel](https://github.com/ever-js/ever-js/blob/master/README.md#kernel)**
* **[main.js](https://github.com/ever-js/ever-js/blob/master/README.md#mainjs)**
* **[package.json](https://github.com/ever-js/ever-js/blob/master/README.md#packagejson)**

---

#### Installing the framework

Please note that, **-g** is required to use.
```js
npm install -g ever-js
```

#### Building the first app
Follow the below mentioned steps to create the first application.

```bash
mkdir MyFirstApp
cd MyFirstApp/
```
Then run following command to initialise framework. 
```bash
everjs init
```

#### Folder structure

```bash
MyFirstApp/
    |-routes/
    	|--Routes.js
	|-lib/
		|--SampleLib.js
	|-configuration/
		|-global/
			|--common.json
			|--default.json
			|--production.json
		|--RestifyConfig.js
	|-handlers/
		|--MongoHandler.js	
	|-filters/
		|--SampleFilters.js
	|-middleware/
		|--SampleMw.js
	|-kernel/
		|--Banner.js  
		|--Kernel.js  
		|--Server.js
	|--main.js
	|--package.json
```
---
#### Global Variables
---

|Variables     |Usage                            |
|--------------|---------------------------------|
| _            | This is Lodash module. <br>eg: <br> _.forEach|
| GlobalConfig | Configureation values based on the environment(default.json or production.json) <br> and common.json <br><br>To access environment based setting values. <br>GlobalConfig.[setting value] <br>eg :<br>GlobalConfig.db.mongo<br><br>To access Common Values in commong.js<br>GlobalConfig.Common.[setting value] <br> eg: <br>GlobalConfig.Common.db_handlers|
| Dbh	       | Contains the Database handlers. <br> Eg: Dbh.Mongo                   |
| Lib | Contains modules defined in **lib/** folder. <br>Eg: Lib.SampleLib.sampleFunction(); <br> (not avaialbe to use inside **lib/** )|



---
#### handlers/
---

This contains all the handler modules. 

---
###### MongoHandler.js
---

This handler manage Mongo Database connections.

Usage of Mongo Hanlder.
```js
sampleFunction : function() {
	Dbh.Mongo.connect(function(err, db){
    			db.collection("Test").find({}).toArray(function(err, result) {
        		console.log(result);
    		});
	});
}
```

---
#### routes/
---
This contains all the routing information. These settings are stored in **Routes.js**

Structure of the Routes.js as follows.

```js
module.exports = {

    getRoutes : function(dependencies) {

        var userFilters = dependencies.UserFilters;
        var userMiddleware = dependencies.userMiddleWare;

        return {            
            GET: [],
            POST: [],
            PUT: [],
            DELETE: []
            }
	}
}
```

* **GET** holds all the routings uses **http GET** method
* **POST** holds all the routing uses **http POST** method
* **PUT** holds all the routing uses **http PUT** method
* **DELETE** holds all the routing uses **http DELETE** method 

* **Adding a new route**
Following is the syntax for adding a route.

```js
HTTP_METHOD : [
	{
		config: {
	    	path: 'Patter of the route',
	    	isSecure: true | false 
		},
		method: userMiddleware.[Middleware Name].[Method Name],
		filters: [filter 1, filter 2, ...]
	}	
]
```

* **config**

>
* **path** - Pattern of the route
* **isSecure** - If set true, a authentication function must be set in the config section as mentioned below section. 


* **method** - Holds middleware to execute on particular pattern
* **filters** - Executes before the Middleware defined in the method section.

The sample Route file is as follows.

```js
module.exports = {

    getRoutes : function(dependencies) {
        var userFilters = dependencies.UserFilters;
        var userMiddleware = dependencies.userMiddleWare;
        return {
            	GET: [
                	{
                    	config: {
                        	path: '/get-sample-route-no-filter',
                        	isSecure: false
                    	},
                    	method: userMiddleware.SampleMw.getWithoutFilters,
                    	filters: []
                	},
                	{
                    		config: {
                        		path: '/get-sample-route-with-filter',
                        		isSecure: true
                    		},
                    		method: userMiddleware.SampleMw.getWithFilters,
                    		filters: [userFilters.SampleFilters.sampleFilter]
                	}
            	],
            	POST: [],
            	PUT: [],
            	DELETE: []
            }
	}
}
```
---
#### lib/
---
> **[Please refer the sample filter file](https://github.com/ever-js/ever-js/blob/master/fw/lib/SampleLib.js)**

Node modules added to this folder can be access via User Middleware and filters.

Syntax for accessing the Lib files.

```js
Lib.[Module file name].[function name]()
```

**Example:**

**sampleFunction()** in **SampleLib.js** module accessible as follows.
```js
Lib.SampleLib.sampleFunction();
```
---
#### configuration//
---

This folder contains the main config file **RestifyConfig.js**

* **AuthFunction** section

```js
  AuthFunction : function(dependencies){
```
In this section, if you do not have any authentication filter, use as follows.
```js
	return false;
```
Else, follow below mentioned syntax,
```js
	return dependencies.filters.[Filter name].[Authentication function name] ;
```
example:
```js
   return dependencies.filters.SampleFilters.sampleAuthFilter;
```

* **AppConfig** section

This section is dedicate to **[Restify Create Server paramters](http://mcavage.me/node-restify/#creating-a-server)**

```js
  AppConfig : function(dependencies){
```
You can add create server parameters as follows,

```js
{
  certificate: ...,
  key: ...,
}
```
This section has the 

* **Application name** retrieves from **package.json**
* **Server Port**, which is **default to 8312** or can be set using an **environment variable : RESTIFY_PORT**
* **Listen address**, which is to all the connections or can be set using an **environment variable: RESTIFY_** **LISTEN**_**IP**

```js
  name: dependencies.packageJson.name,
  port : 8312 || process.env.RESTIFY_PORT,
  address : "0.0.0.0" || process.env.RESTIFY_LISTEN_IP
```

* **RestifyMiddlewareSet** section

This section is used to load the **[Restify plugins](http://mcavage.me/node-restify/#bundled-plugins)**

```js
  RestifyMiddlewareSet : function(dependencies) {
```
Following plugins are loaded as default settings
```js
  dependencies.restifyObject.acceptParser(dependencies.serverObject.acceptable),
  dependencies.restifyObject.gzipResponse(),
  dependencies.restifyObject.queryParser(),
  dependencies.restifyObject.bodyParser()
```

* **RestifyPre** section

This section is used to load Restify's **pre()** modules.  
```js
  RestifyPre : function(dependencies) {
```
Use the following syntax to load the load the modules.

```js
dependencies.restifyObject.[pre filter|pre function|pre module]
```
Example :
```js
return [
          dependencies.restifyObject.pre.sanitizePath(),
          dependencies.restifyObject.pause()
    ];
```
---
##### configuration/global/
---
Contains all the configuration values based environment.
If **NODE_ENV** is **NOT** defined, **default.json** is loaded.
for Production configuration values.
```bash
export NODE_ENV=production
```
| File name  | Descriptions   | Environment
|---|---|---|
|default.json| contains none production environment values. <br>| default environment.  |
|production.json| contains production enviroment values.   |  Production |
|common.json|Contains common values for both the enviroments   | All  |

---
##### default.json
---

```json
{
	"environment" : "default",
	"connectionStrings" : {
		"mongo" : "mongodb://127.0.0.1/test"
	}
}
```
---
##### production.json
---
```json
{
	"environment" : "production",
	"db" : {
		"mongo" : "mongodb://127.0.0.1/test"
	}
}
```

---
##### common.json
---
```json
{
	"port" : "8312",
	"address" : "0.0.0.0",
	"db_handlers" : {
		"Mongo" : {
			"enable" : true,
			"libPath" : "../handlers/MongoHandler.js"
		}
	}
}
```
**db_handlers** contains the information of each Database handler.
**libPath** must be defined relative to the **kernel/**


---
#### filters/
---
> **[Please refer the sample filter file](https://github.com/ever-js/ever-js/blob/master/fw/filters/SampleFilters.js)**

Contains the functionality which executes prior to assigned user middleware.

Node modules added to this folder can be access from **Routes.js**.

**Format of the filter function is very important !!!**

Please follow below mentioned format for filter function.

```js
function(req, res, next) {
        //Your logic goes here
        next();
}
```

sample filter :

```js
sampleFilter : function(req,res,next) {
        console.log("Sample Filter.");
        next();
}
```

Syntax for accessing the filter files from Routes.js.

```js
userFilters.[Filter file name].[filter function name]
```
Example:

**sampleFilter()** in **SampleFilters.js** module accessible as follows.

```js
userFilters.SampleFilters.sampleFilter();
```
---
#### middleware/
---
> **[Please refer the sample filter file](https://github.com/ever-js/ever-js/blob/master/fw/middleware/SampleMw.js)**

Contains the functionality which executes based on the route patterns.

Node modules added to this folder can be access from **Routes.js**.

**Format of the Middleware function is very important !!!**

Please follow below mentioned format for filter function.

```js
function(req, res, next) {
        //Your logic goes here
}
```

sample Middleware :

```js
getWithoutFilters: function (req, res, next) {
   res.send(200, {msg: "GET Without Filters"});
},
```

Syntax for accessing the filter files from Routes.js.

```js
userMiddleware.[Middleware file name].[Middleware function name]
```
Example:

**getWithoutFilters()** in **SampleMw.js** module accessible as follows.

```js
userFilters.SampleMw.getWithoutFilters;
```
---
#### kernel/
---
Contains the heart of the framework. Try not to edit this.

> But, be my guest to suggest any modification.

* **Kernel.js** - Loads all the dependencies and pass them to modules.
* **Server.js** - This is where Restify server loads all the routes, lib, middleware, filter and configs.
* **Banner.js** - Just prints my logo :)

---
#### main.js

---
Executes the kernel of the framework. Not much to see.

---

#### package.json
---
Default package.json for the current application. You can add any dependencies which required. But, please do not remove any existing ones.
