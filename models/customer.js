var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/caradmin');
var crypto=require("crypto");

var staffSchema = new mongoose.Schema({
    sid  : Number ,
    name : String,
    sex  : String,
    phone  : Number,
    address  : String,
    idcard : String,
    license : Number,
});

staffSchema.statics.addStaff = function(json,callback){
    Staff.checkSid(json.sid,function(torf){
        if(torf){
            var s = new Staff(json);
            s.save(function(err){
                if(err){
                    callback(-2)
                    return;
                }
                callback(1);
            });

        }else{
            callback(-1);
        }
    });
};
staffSchema.statics.checkSid = function(sid,callback){
    this.find({"sid" : sid} , function(err,results){
        //如果没有相同的id，返回true
        //如果有相同的id返回false
        callback(results.length == 0);
    });
};

var Staff = mongoose.model("customer",staffSchema);


module.exports = Staff;