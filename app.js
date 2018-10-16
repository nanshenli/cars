var express=require("express");
var app=express();
var mongoose = require('mongoose');
var control=require("./control/control.js");
var session = require('express-session');
mongoose.connect('mongodb://localhost/caradmin');

app.set("view engine","ejs");

app.use(express.static("static"));
app.use(session({
    secret: 'shuoshuo',
    resave: false,
    saveUninitialized: true,
}));

app.get("/",control.showIndex);//显示登录页面
app.post("/checklogin",control.checklogin);//判断登录


app.get("/client",control.showClient);//显示客人查询页面
app.post('/add'	, control.add);//添加客户
app.get('/staff',control.getAllStaff);//获取所有客户（分页）
app.delete('/remove/:sid', control.deleteStaff);//删除客户
app.get('/updata/:sid', control.showUpdate);//更改客户信息
app.post('/toupdata/:sid', control.updatestaff);//确认更改
app.get('/getCustomer', control.getCustomer);//获取所有客户

app.get("/class",control.showClass);//显示类别档案页面
//汽车档案的增删改查
app.post('/addCar'	, control.addCar);
app.get('/allCar',control.getAllCar);
app.delete('/removeCar/:sid', control.deleteCar);
app.get('/updataCar/:sid', control.showUpdateCar);
app.post('/toupdataCar/:sid', control.updateCar);

app.get("/car",control.showCar);//显示汽车系统页面
//汽车信息的增删改查
app.post('/addCarInfo'	, control.addCarInfo);
app.get('/getAllCarName',control.findAllCarName);
app.get('/allCarInfo',control.getAllCarInfo);
app.delete('/removeCarInfo/:sid', control.deleteCarInfo);
app.get('/updataCarInfo/:sid', control.showUpdateCarInfo);
app.post('/toupdataCarInfo/:sid', control.updateCaInfor);

app.get("/lease",control.showLease);//显示租赁页面
app.get('/findname',control.findname);
app.get('/allRent',control.getallRent);
app.get('/allRent/:category',control.getByName);
app.get('/updateState/:sid', control.updateState);
app.post('/addRent', control.addRent);

app.get("/return",control.showRecent);//显示归还页面
app.get('/returnState/:sid', control.returnState);
app.delete('/removeCarReturn/:sid', control.deleteCarReturn);
app.post('/addReturn', control.addReturn);
app.get('/returnStatistical',control.getAllReturnCar);
app.get("/result",control.showResult);
app.get("/resulttwo",control.showResulttwo);

app.get("/statistical",control.showStatistical);//显示统计页面
app.get('/rentStatistical',control.getAllRentCar);
app.get('/rentStatis',control.rentStatis);

app.listen(3010);