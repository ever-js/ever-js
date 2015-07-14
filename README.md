[E]njoyment [V]ia [E]asiness of [R]estify - js
======================

#####(Alpha Release)
---
### This framework is completely based on **[Restify](http://mcavage.me/node-restify/)**.

---
* **[Installing the ever-js](https://github.com/ever-js/ever-js/blob/master/README.md#installing-the-framework)**
* **[Folder structure](https://github.com/ever-js/ever-js/blob/master/README.md#folder-structure)**
* **[Routes](https://github.com/ever-js/ever-js/blob/master/README.md#routes)**
* **[Library](https://github.com/ever-js/ever-js/blob/master/README.md#lib)**
* **[Config](https://github.com/ever-js/ever-js/blob/master/README.md#config)**
* **[User Filters](https://github.com/ever-js/ever-js/blob/master/README.md#filters)**
* **[User Middleware](https://github.com/ever-js/ever-js/blob/master/README.md#middleware)**
* **[Kernel](https://github.com/ever-js/ever-js/blob/master/README.md#kernel)**
* **[main.js](https://github.com/ever-js/ever-js/blob/master/README.md#mainjs)**
* **[package.json](https://github.com/ever-js/ever-js/blob/master/README.md#packagejson)**
---

####Installing the framework

Please note that, **-g** is required to use.
```js
npm install -g ever-js
```

####Building the first app
Follow the below mentioned steps to create the first application.

```bash
mkdir MyFirstApp
cd MyFirstApp/
```
Then run following command to initialise framework. 
```bash
everjs init
```

####Folder structure

```bash
MyFirstApp/
	|-routes/
		|--Routes.js
	|-lib/
		|--SampleLib.js
	|-config/
		|--RestifyConfig.js
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
####routes/
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
####lib/
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
####config/
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
####filters/
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
####middleware/
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
####kernel/
---
Contains the heart of the framework. Try not to edit this.

> But, be my guest to suggest any modification.

* **Kernel.js** - Loads all the dependencies and pass them to modules.
* **Server.js** - This is where Restify server loads all the routes, lib, middleware, filter and configs.
* **Banner.js** - Just prints my logo :)

---
####main.js

---
Executes the kernel of the framework. Not much to see.

---

####package.json
---
Default package.json for the current application. You can add any dependencies which required. But, please do not remove any existing ones.
