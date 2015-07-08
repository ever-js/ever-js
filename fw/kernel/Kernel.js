/**
 * Created by ruwang on 7/8/15.
 */
var _ = require("lodash");
var fs = require("fs");
var path = require("path");

var fileStructure = {
    MY_DEPTH_FROM_ROOT : "..",
    LIB : "./lib",
    CONFIG : "config",
    USER_MIDDLE_WARE : "middleware",
    ROUTES : "routes"
};

var loadLib = function(libPath) {
    console.log("Loading Libraries...");
    var libSet = {};
    var libs = loadLibFiles(fileStructure.LIB);
    if(!_.isEmpty(libs)) {
        _.forEach(libs, function (libPath, libName) {
            libSet[libName] = require(libPath);
        });
    }
    return libSet;
}
var loadLibFiles = function(libPath) {
    var fileList = fs.readdirSync(path.resolve(libPath));
    var libFileSet = {};
    _.forEach(fileList, function(file){
        if(path.extname(file).toLowerCase() == ".js") {
            libFileSet[path.basename(file, '.js')] =
                fileStructure.MY_DEPTH_FROM_ROOT + path.sep+path.join(libPath, path.basename(file, '.js'));
        }
    });

    return libFileSet;
}

var kernel = function() {
    var pub = {};
    pub.start = function() {
        var libSet = loadLib(fileStructure.LIB);
        console.log("Starting ever...");
    };
    return pub;
}

module.exports = kernel();