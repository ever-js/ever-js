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

#####config/
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
Else, follow below mentioned syntax
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

```json
{
  certificate: ...,
  key: ...,
}
```
This section has the 

* **Application name** retrieves from **package.json**
* **Server Port**, which is **default to 8312** or can be set using an **environment variable : RESTIFY_PORT**
* **Listen address**, which is to all the connections or can be set using an **environment variable: 
RESTIFY__LISTEN_IP **

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

```js
  RestifyPre : function(dependencies) {
```
