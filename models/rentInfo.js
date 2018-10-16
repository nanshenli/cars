var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/caradmin');

var staffSchema = new mongoose.Schema({
    sid: Number,
    name : String,
    customer : String,
    long : Number,
    every : Number,
    total : Number,
    date : Date,
    manager : String,
    state : Number,
});

staffSchema.statics.addStaff = function(json,callback){
    rentInfo.checkSid(json.name,function(torf){
        if(torf){
            var s = new rentInfo(json);
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
staffSchema.statics.checkSid = function(name,callback){
    this.find({"name" : name} , function(err,results){
        callback(results.length == 0);
    });
};

var rentInfo = mongoose.model("rentInfo",staffSchema);


module.exports = rentInfo;