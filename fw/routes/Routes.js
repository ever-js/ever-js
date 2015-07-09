/**
 * Created by ruwang on 7/8/15.
 */
module.exports = {

    getRoutes : function(dependencies) {

        var userFilters = dependencies.UserFilters;
        var userMiddleware = dependencies.userMiddleWare;

        return {

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
        }
    }
}