/**
 * Created by ruwang on 7/8/15.
 */
var sampleMiddleWare = {
    getWithoutFilters: function (req, res, next) {
        res.send(200, {msg: "GET Without Filters"});
    },
    getWithFilters: function (req, res, next) {
        Lib.SampleLib.sampleFunction();
        res.send(200, {msg: "GET With Filters"});
    },
    postWithoutFilters: function (req, res, next) {
        res.send(200, {msg: "POST Without Filters"});
    },
    postWithFilters: function (req, res, next) {
        res.send(200, {msg: "POST With Filters"});
    },
    putWithoutFilters: function (req, res, next) {
        res.send(200, {msg: "PUT Without Filters"});
    },
    putWithFilters: function (req, res, next) {
        res.send(200, {msg: "PUT With Filters"});
    },
    deleteWithoutFilters: function (req, res, next) {
        res.send(200, {msg: "DELETE Without Filters"});
    },
    deleteWithFilters: function (req, res, next) {
        res.send(200, {msg: "DELETE With Filters"});
    }
}
module.exports = sampleMiddleWare;