'use strict'
var _ = require("lodash");
module.exports = {

    printItem : function(collection, log) {
      _.each(collection, function(routes){
        log("\tRoute -> " + routes.config.path);
      });
    },
    printRoutes : function(routeObject, log) {

      log("------------------------------");
      log("GET : ");
      this.printItem(routeObject.GET, log);
      log("------------------------------");
      log("POST : ");
      this.printItem(routeObject.POST, log);
      log("------------------------------");
      log("PUT : ");
      this.printItem(routeObject.PUT, log);
      log("------------------------------");
      log("DELETE : ");
      this.printItem(routeObject.DELETE, log);
      log("------------------------------");

    },

    getRoutes : function(dependencies) {

        var userFilters = dependencies.UserFilters;
        var userMiddleware = dependencies.userMiddleWare;
        var log =dependencies.log;

        var routes = {

            //Add routes here. as shown in the sample

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
            POST: [
                {
                    config: {
                        path: '/post-sample-route-no-filter',
                        isSecure: false
                    },
                    method: userMiddleware.SampleMw.postWithoutFilters,
                    filters: []
                },
                {
                    config: {
                        path: '/post-sample-route-with-filter',
                        isSecure: true
                    },
                    method: userMiddleware.SampleMw.postWithFilters,
                    filters: [userFilters.SampleFilters.sampleFilter]
                }
            ],
            PUT: [
                {
                    config: {
                        path: '/put-sample-route-no-filter',
                        isSecure: false
                    },
                    method: userMiddleware.SampleMw.putWithoutFilters,
                    filters: []
                },
                {
                    config: {
                        path: '/put-sample-route-with-filter',
                        isSecure: true
                    },
                    method: userMiddleware.SampleMw.putWithFilters,
                    filters: [userFilters.SampleFilters.sampleFilter]
                }
            ],
            DELETE: [
                {
                    config: {
                        path: '/delete-sample-route-no-filter',
                        isSecure: false
                    },
                    method: userMiddleware.SampleMw.deleteWithoutFilters,
                    filters: []
                },
                {
                    config: {
                        path: '/delete-sample-route-with-filter',
                        isSecure: true
                    },
                    method: userMiddleware.SampleMw.deleteWithFilters,
                    filters: [userFilters.SampleFilters.sampleFilter]
                }
            ]
        };

        this.printRoutes(routes, log);
        return routes;
    }
}