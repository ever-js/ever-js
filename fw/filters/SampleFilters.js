/**
 * Created by ruwang on 7/10/15.
 */
module.exports = {
    sampleFilter : function(req,res,next) {
        console.log("Sample Filter.");
        next();
    },
    sampleAuthFilter : function(req,res,next) {
        console.log("AUTH Sample Filter.");
        next();
    }
}