var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/caradmin');

var staffSchema = new mongoose.Schema({
    sid  : Number ,
    name : String,
    category : String,
    price : Number,
    state : Number,
    rentcount : Number
});

staffSchema.statics.addStaff = function(json,callback){
    Carinfo.checkSid(json.sid,function(torf){
        if(torf){
            var s = new Carinfo(json);
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
        callback(results.length == 0);
    });
};

var Carinfo = mongoose.model("carInfo",staffSchema);


module.exports = Carinfo;