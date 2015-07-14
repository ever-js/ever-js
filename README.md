ever-js is Easy With Extended Restify 
======================
#####(Alpha Release)
### This framework is completely based on **[Restify](http://mcavage.me/node-restify/)**.

---
####Installing the framwork

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
	|-config/
		|--RestifyConfig.js
	|-filters/
		|--SampleFilters.js
	|-kernel/
		|--Banner.js  
		|--Kernel.js  
		|--Server.js
	|-lib/
		|--SampleLib.js
	|-middleware/
		|--SampleMw.js
	|-routes/
		|--Routes.js
	|--main.js
	|--package.json
```

####routes/
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

* ** GET ** holds all the routings uses **http GET** method
* ** POST ** holds all the routing uses **http POST** method
* ** PUT ** holds all the routing uses **http PUT** method
* ** DELETE ** holds all the routing uses **http DELETE** method 

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
* **Listen address**, which is to all the connections or can be set using an **environment variable: RESTIFY__LISTEN_IP **

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
