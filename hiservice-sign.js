var http = require('http');
var querystring = require('querystring');

var code;
var sessionId;
var contents = querystring.stringify({
    'companyname': '海斯维思办公系统',
    'username': '***',
    'password': '***'
});

var options = {
    host: '221.6.106.230',
    port: '8088',
    path: '/HiServiceCRM/login',
    method: 'post',
    headers:{  
        "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",  
        "Content-Length":contents.length,         
        "Accept":"application/json, text/javascript, */*; q=0.01",  
        "Accept-Language":"zh-cn",  
        "Cache-Control":"no-cache",  
        "Connection":"Keep-Alive",    
        "Host":"bbs.byr.cn",  
        "Referer":"http://221.6.106.230:8088/HiServiceCRM/index",  
        "User-Agent":"Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BOIE9;ZHCN)",  
        "X-Requested-With":"XMLHttpRequest"  
    } 
};

function login(){
    var req = http.request(options, function(res){
        res.setEncoding('utf8');
        console.log(res.headers['set-cookie'][0]);
        sessionId = getSessionId(res.headers['set-cookie'][0]);
        res.on('data', function(data){
            var result = JSON.parse(data);
            result = JSON.parse(result.result);
            console.log(result);
            code = result.result;
        }).on('end', function(){
            if(code === 'SUCCESS'){
                console.log("登录成功");
                sign();
            }
        });
    });

    req.write(contents);
    req.end();
}

function logout(){
    options.path = '/HiServiceCRM/logout?isBilling=false';
    var req = http.request(options, function(res){
        res.setEncoding('utf8');
        res.on('data', function(data){
            console.log("成功退出");
        });
    });
    req.end();
}

function sign(){
    var now = new Date();
    options.path = '/HiServiceCRM/updateSignIn_isSignIn.action?t='+now.getTime()+'&moduleId=30';
    options.method = 'get';
    options.headers['Content-Length'] = 0;
    options.headers['Cookie'] = "JSESSIONID="+sessionId;
    var req = http.request(options, function(res){
        res.setEncoding('utf8');
        res.on('data', function(data){
            if(data=="cannot"){
                console.log("你无权进行签到，请联系管理员!");
            }else if(data=="hasdone"){
                console.log("您今日已经签到签退成功，无需操作！");
            }else if(data=="signup"){
                console.log("签退成功!");
            }else if(data=="success"){
                console.log("签到成功!");
            }else if(data=="failing"){
                console.log("签到失败!");
            }
        }).on('end', function(){
            logout();
        });
    });
    req.end();
}

function getSessionId(str){
    var end = str.indexOf(';');
    return str.substring(11, end);
}

login();