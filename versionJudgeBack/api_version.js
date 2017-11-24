var fs= require("fs");
var express = require('express');
var app = express();
var apiRoute = express.Router()


function errorResponse(error) {
  return {
    error: error,
    message: '',
    status: 4001,
    payload: {}
  }
}

function getNowTimeStr() {
  var now = new Date();
  var yy = now.getFullYear();      //年
  var mm = now.getMonth() + 1;     //月
  var dd = now.getDate();          //日
  var hh = now.getHours();         //时
  var ii = now.getMinutes();       //分
  var ss = now.getSeconds();       //秒
  var clock = yy + "-";
  if(mm < 10) clock += "0";
  clock += mm + "-";
  if(dd < 10) clock += "0";
  clock += dd + " ";
  if(hh < 10) clock += "0";
  clock += hh + ":";
  if (ii < 10) clock += '0';
  clock += ii + ":";
  if (ss < 10) clock += '0';
  clock += ss;

  return clock;
}

var appMap = {
  '1': 'mobbs'
};
var osMap = {
  '1': 'ios',
  '2': 'android',
  '3': 'ios && android'
}

function saveData(path, map) {
  // 读文件
  try {
    var data = JSON.parse(fs.readFileSync(path));
    var creatTime = data.createTime;
    var newPath = path.replace('.json', '_' + creatTime.replace(/[-: ]/g, '_') + '_history.json');
    fs.writeFileSync(newPath, JSON.stringify(data));
  } catch (e) {
    if (e.code === 'ENOENT') {
    } else {
      console.log(e);
      return '系统错误'
    }
  }
  // 写文件
  try {
    fs.writeFileSync(path, JSON.stringify(map));
  } catch (e) {
    console.log(e);
    return '系统错误'
  }
  return false;
}
// 插入最新版本数据
apiRoute.post('/version/setversion', function (req, res) {
  var app = req.body.app;
  if (!app || (app != '1')) {
    res.json(errorResponse('app参数未传或不合法'))
  }
  var os = req.body.os;
  if (!os || (os != '1' && os != '2' && os != '3')) {
    res.json(errorResponse('os参数未传或不合法'))
  }
  app = app.toString();
  os = os.toString();

  var version = req.body.version;
  if (!version) {
    res.json(errorResponse('版本号为必传字段'))
  }
  var isForceUpdate = req.body.isForceUpdate;
  if (!isForceUpdate) {
    isForceUpdate = 0
  }
  var instructions = req.body.instructions;
  if (!instructions) {
    instructions = [];
  }

  var map = {
    "createTime": getNowTimeStr(),
    "version": version,
    "instructions": instructions,
    "isForceUpdate": isForceUpdate
  }

  if (os == '3') {
    var jsonName1 = appMap[app] + '_' + osMap['1'];
    var path1 = './version/' + jsonName1 + '.json';
    let errorMessage1 = saveData(path1, map);
    if (errorMessage1) {
      res.json(errorResponse(errorMessage1))
    }

    var jsonName2 = appMap[app] + '_' + osMap['2'];
    var path2 = './version/' + jsonName2 + '.json';
    let errorMessage2 = saveData(path2, map);
    if (errorMessage2) {
      res.json(errorResponse(errorMessage2))
    }
  } else {
    var jsonName = appMap[app] + '_' + osMap[os];
    var path = './version/' + jsonName + '.json';
    let errorMessage = saveData(path, map);
    if (errorMessage) {
      res.json(errorResponse(errorMessage))
    }
  }


  res.json({
    message: '成功',
    status: 3001,
    payload: {}
  });
})


// 获取最新版本数据
apiRoute.post('/version/getversion', function (req, res) {
  var app = req.body.app;
  if (!app || (app != '1')) {
    res.json(errorResponse('app参数未传或不合法'))
  }
  var os = req.body.os;
  if (!os || (os != '1' && os != '2')) {
    res.json(errorResponse('os参数未传或不合法'))
  }
  app = app.toString();
  os = os.toString();

  var jsonName = appMap[app] + '_' + osMap[os];
  var path = './version/' + jsonName + '.json';

  var data = {};
  try {
    data = JSON.parse(fs.readFileSync(path));
  } catch (e) {
    console.log(e);
    res.json(errorResponse('未查到版本信息'))
  }
  var version = data.version;
  if (!version) {
    res.json(errorResponse('未查到版本信息'))
  }

  res.json({
    message: '成功',
    status: 3001,
    payload: data
  });
})

module.exports = apiRoute;