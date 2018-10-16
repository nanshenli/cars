var formidable=require("formidable");
var crypto=require("crypto");
var user=require("../models/user.js");
var Staff=require("../models/customer.js");
var Car=require("../models/carCategory.js");
var CarInfo=require("../models/carinfo.js");
var rentInfo=require("../models/rentInfo.js");
var returnInfo=require("../models/returnInfo.js");

var url=require("url");

// 显示登录页面
exports.showIndex=function(req,res){
    res.render("index");
};

// 判断登录
exports.checklogin=function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files) {
        var uname=fields.uname;
        var psword=fields.psword;
        var jiami=crypto.createHmac('sha256',psword).digest('hex');
        user.findUname(uname, function (err, obj) {
            if (!obj) {
                res.json({"result": -1})
                return;
            }
            if(jiami===obj.psword){
                req.session.login=1;
                req.session.uname=uname;
                res.json({"result": 1});
                return;
            }else{
                res.json({"result":-2});
                return;
            }
        })
    })
};

//显示客人查询页面
exports.showClient=function(req,res){
    if(!(req.session.login==1 && req.session.uname)){
        res.send("本页面需要登录，请<a href='/'>登录</a>");
        return;
    }
    res.render("client",{
        "uname":req.session.uname
    });
};

// 添加客户
exports.add=function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        Staff.addStaff(fields,function(result){
            res.json({"result" : result});
        });
    });
};

//获取所有客户（增加分页）
exports.getAllStaff = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 9;
    Staff.count({},function(err,count){
        Staff.find({}).sort({"sid":-1}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });

};

//删除客户
exports.deleteStaff = function(req,res){
    var sid = req.params.sid;
    Staff.find({"_id" : sid},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }


        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }

            res.json({"result" : 1});
        });
    });
};

//更改客户信息
exports.showUpdate = function(req,res){
    var sid = req.params.sid;
    Staff.find({"_id" : sid},function(err,results){
        if(results.length == 0){
            res.json({"result":-1});
            return;
        }
        res.json({
            "updata" : results
        });
    });
};

//确认修改
exports.updatestaff = function(req,res){
    var sid = req.params.sid;
    if(!sid){
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        Staff.find({"_id" : sid},function(err,results){
            if(results.length == 0){
                res.json({"result" : -1});
                return;
            }

            var thestaff = results[0];
            thestaff.name = fields.name;
            thestaff.sex = fields.sex;
            thestaff.phone = fields.phone;
            thestaff.address = fields.address;
            thestaff.idcard = fields.idcard;
            thestaff.license = fields.license;


            //持久化
            thestaff.save(function(err){
                if(err){
                    res.json({"result" : -1});
                }else{
                    res.json({"result" : 1});
                }
            });
        });
    });
};

//获取所有客户
exports.getCustomer=function(req,res){
    Staff.find({},function(err,results){
        res.json({"results" : results});
    });
}


//显示类别档案页面
exports.showClass=function(req,res){
    if(!(req.session.login==1 && req.session.uname)){
        res.send("本页面需要登录，请<a href='/'>登录</a>");
        return;
    }
    res.render("category",{
        "uname":req.session.uname
    });
};
//汽车档案的增删改查
exports.addCar=function (req,res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        Car.addStaff(fields,function(result){
            res.json({"result" : result});
        });
    });
};
exports.getAllCar = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 9;
    Car.count({},function(err,count){
        Car.find({}).sort({"sid":1}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });

};
exports.deleteCar = function(req,res){
    var sid = req.params.sid;
    Car.find({"_id" : sid},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }
            res.json({"result" : 1});
        });
    });
};
exports.showUpdateCar = function(req,res){
    var sid = req.params.sid;
    Car.find({"_id" : sid},function(err,results){
        if(results.length == 0){
            res.json({"result":-1});
            return;
        }
        res.json({
            "updata" : results
        });
    });
};
exports.updateCar = function(req,res){
    var sid = req.params.sid;
    if(!sid){
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

        Car.find({"_id" : sid},function(err,results){
            if(results.length == 0){
                res.json({"result" : -1});
                return;
            }
            var thestaff = results[0];
            //更改属性
            // thestaff.sid = fields.sid;
            thestaff.category = fields.category;
            //持久化
            thestaff.save(function(err){
                if(err){
                    res.json({"result" : -1});
                }else{
                    res.json({"result" : 1});
                }
            });
        });
    });
};

//显示汽车系统页面
exports.showCar=function(req,res){
    if(!(req.session.login==1 && req.session.uname)){
        res.send("本页面需要登录，请<a href='/'>登录</a>");
        return;
    }
    res.render("car",{
        "uname":req.session.uname
    });
}
//汽车信息的增删改查
exports.addCarInfo=function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        CarInfo.addStaff(fields,function(result){
            res.json({"result" : result});
        });
    });
};
exports.findAllCarName=function(req,res){
    Car.find({},function(err,obj){
        res.json({"results" : obj});
    })
};
exports.getAllCarInfo = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 9;
    CarInfo.count({},function(err,count){
        CarInfo.find({}).sort({"sid":1}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
};
exports.deleteCarInfo = function(req,res){
    var sid = req.params.sid;
    CarInfo.find({"_id" : sid},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }
            res.json({"result" : 1});
        });
    });
};
exports.showUpdateCarInfo = function(req,res){
    var sid = req.params.sid;
    CarInfo.find({"_id" : sid},function(err,results){

        if(results.length == 0){
            res.json({"result":-1});
            return;
        }
        res.json({
            "updata" : results
        });
    });
};
exports.updateCaInfor = function(req,res){
    var sid = req.params.sid;
    if(!sid){
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

        CarInfo.find({"_id" : sid},function(err,results){
            if(results.length == 0){
                res.json({"result" : -1});
                return;
            }
            var thestaff = results[0];
            //更改属性
            thestaff.name  = fields.name;
            thestaff.category  = fields.category;
            thestaff.price  = fields.price;

            //持久化
            thestaff.save(function(err){
                if(err){
                    res.json({"result" : -1});
                }else{
                    res.json({"result" : 1});
                }
            });
        });
    });
};

//显示租赁页面
exports.showLease=function(req,res){
    if(!(req.session.login==1 && req.session.uname)){
        res.send("本页面需要登录，请<a href='/'>登录</a>");
        return;
    }
    res.render("lease",{
        "uname":req.session.uname
    });
};
//租赁
exports.findname=function(req,res){
    CarInfo.find({},function(err,obj){
        // console.log(obj);
        var arr=[];
        for(var i=0;i<obj.length;i++){
            arr.push(obj[i].category)
        }

        function unique3(arr){
            var res = [];
            var obj = {};
            for(var i=0; i<arr.length; i++){
                if( !obj[arr[i]] ){
                    obj[arr[i]] = 1;
                    res.push(arr[i]);
                }
            }
            return res;
        }
        res.json({
            "allname":unique3(arr),
            "all":obj
        });
    })
}
exports.getallRent = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 9;
    CarInfo.count({},function(err,count){
        CarInfo.find({}).sort({"state":-1}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
};
exports.getByName = function(req,res){
    var category = req.params.category;
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 9;
    CarInfo.count({"category":category},function(err,count){
        CarInfo.find({"category":category}).sort({"state":-1}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
};
exports.updateState = function(req,res){
    var sid = req.params.sid;
    if(!sid){
        return;
    }
    CarInfo.find({"_id" : sid},function(err,results){
        if(results.length == 0){
            res.json({"result" : -1});
            return;
        }
        var thestaff = results[0];
        //更改属性
        thestaff.state  = 1;
        thestaff.rentcount  = parseInt(thestaff.rentcount) + 1;
        //持久化
        thestaff.save(function(err){
            if(err){
                res.json({"result" : -1});
            }else{
                res.json({"result" : 1});
            }
        });
    });
};
exports.addRent=function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        rentInfo.addStaff(fields,function(result){
            res.json({"result" : result});
        });
    });
};

//显示归还页面
exports.showRecent=function(req,res){
    if(!(req.session.login==1 && req.session.uname)){
        res.send("本页面需要登录，请<a href='/'>登录</a>");
        return;
    }
    res.render("return",{
        "uname":req.session.uname
    });
};
exports.returnState = function(req,res){
    var sid = req.params.sid;
    if(!sid){
        return;
    }
    CarInfo.find({"sid" : sid},function(err,results){
        if(results.length == 0){
            res.json({"result" : -1});
            return;
        }
        var thestaff = results[0];
        //更改属性
        thestaff.state  = 0;
        //持久化
        thestaff.save(function(err){
            if(err){
                res.json({"result" : -1});
            }else{
                res.json({"result" : 1});
            }
        });
    });
};
exports.deleteCarReturn = function(req,res){
    var sid = req.params.sid;
    rentInfo.find({"sid" : sid},function(err,results){
        // console.log(results);
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }
            res.json({"result" : 1});
        });
    });
};
exports.addReturn=function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        returnInfo.addStaff(fields,function(result){
            res.json({"result" : result});
        });
    });
};
//归还统计
exports.getAllReturnCar = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 9;
    returnInfo.count({},function(err,count){
        returnInfo.find({}).sort({"sid":-1}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
};
exports.showResult=function(req,res){
    CarInfo.find({},function(err,result){
        res.json({"result":result})
    })
};
exports.showResulttwo=function(req,res){
    returnInfo.find({},function(err,result){
        res.json({"result":result})
    })
};



//显示登录页面
exports.showStatistical=function(req,res){
    if(!(req.session.login==1 && req.session.uname)){
        res.send("本页面需要登录，请<a href='/'>登录</a>");
        return;
    }
    res.render("statistical",{
        "uname":req.session.uname
    });
}
//租车统计
exports.getAllRentCar = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 9;
    rentInfo.count({},function(err,count){
        rentInfo.find({}).sort({"sid":-1}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
};
//归还
exports.rentStatis=function(req,res){  //在租赁的所有车
    rentInfo.find({},function(err,obj){
        res.json({"all":obj});
    })
}






















// exports.getAll=function(req,res){
//     Kitten.find({},function(err,r){
//
//         if(err){
//             return;
//         }
//         res.json({
//             "results":r
//         })
//     })
// };
// exports.updateInfo=function(req,res){
//     var sid=req.params.sid;
//     var form = new formidable.IncomingForm();
//     form.parse(req,function(err,fields,files){
//         Kitten.update({"num":sid},{"$set":fields},function(err,r){
//             res.redirect("/")
//             // res.send("修改成功<a href='/'>返回查看结果</a>")
//         })
//     })
// }
//















