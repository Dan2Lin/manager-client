/**
 * Created by steve on 14-9-18.
 */
define(['jquery', 'dialogs'], function ($, dia) {
	//PROD
    // var domain = 'https://120.24.70.17:8443';

    // UAT
    var domain = 'https://uat.redgltc.com:8443';

    // SIT
    //  var domain = 'http://120.24.55.7:8086';

    // Develop
    // var domain = 'http://139.196.120.235:8080';
    // var domain = 'http://59.110.229.231:8080';

    //local
    var url_base = domain+'/staff/';
//	var domain='http://localhost:8080';
    //var url_upload = domain+'/uploadsvr/';
    var url_upload = domain+'/file_upload_servers/';
    var url_export_ca = domain + '/staff/';

    sessionStorage.setItem('baseUrl', JSON.stringify(url_base));

    var user = JSON.parse(sessionStorage.getItem('login_user'));

    var escapeHTML = (function() {

    var chars = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '/': '&#47;',
    '<': '&lt;',
    '>': '&gt;'
    };

    return function(text) {
    return String(text).replace(/[\"'\/<>]/g, function(char) {
    return chars[char];
    });
    };

    }());
    function escapeParme(value){
        var escapeParme = ['news.content','activity.description','news.pic','activity.banner','bookInfo.book_cover', 'survey.banner', 'survey.description', 'paramStr'];
        var result = false;
        for(var escapep in escapeParme){
            if(value == escapeParme[escapep]){
                result = true;
            } else if(value.match(/^survey\.questions\[[0-9]+\]\.banner$/g) !== null){
                result = true;
            }
        }
        return result;
    }

    function removeEmptyvalueJson(parameters){
        var res={};
        for(var o in parameters){
            if(parameters[o]==""){
                continue;
            }else{
//                console.log((escapeParme(o)) +"____"+o+"____"+typeof(parameters[o]));
                if(escapeParme(o) || typeof(parameters[o]) == "undefined"){
                    res[o] = parameters[o];
                }else{
                    res[o] = escapeHTML(parameters[o]);
                }
            }
        }
        return res;
    }

    var net = {
        url_upload:url_upload,
        url_export_ca: url_export_ca,

        get: function (url, parameters, fail, success) {
            console.log('---请求参数---');
            console.log('url:');
            console.log(url);
            console.log('parameters:');
            console.log(parameters);

            var rparms = removeEmptyvalueJson(parameters);

            // 链接参数到url
            var full_url = url_base + url + "?";
            var i = 0;
            $.each(rparms, function (key, value) {
                if (i == 0) {
                    full_url += key + "=" + value;
                } else {
                    full_url += "&" + key + "=" + value;
                }
            });

            // GET
            $.ajax({
                type: 'GET',
                url: full_url,
                dataType: 'json',
                beforeSend: function(xhr) {
                    if (sessionStorage.getItem('login_user')!=null) {
                        console.log('user:%o', user);
                        xhr.setRequestHeader('BasicAuthUsername', user.userId);
                    }
                }
            }).fail(function (error) {
                console.error(error);
                dia.alert('Message', 'Please check your network.', ['OK'], 'fail', function (title) {
                });
                fail('Please check your network.');
            }).done(function (response) {
                console.log(response);
                success(response);
            });
        },

        post: function (url, parameters, fail, success,params) {
            console.log('---POST Request---');
            console.log('url: %o', url);
            console.log('parameters: %o', parameters);
            var async = true;
            if(params && typeof(params.asyncPra) != "undefined"){
                async = params.asyncPra;
            }
            var rparms = removeEmptyvalueJson(parameters);

            // POST
            $.ajax({
                type: 'POST',
                url: url_base + url,
                dataType: 'json',
                data: rparms,
                async:async,
                beforeSend: function(xhr) {
                    if (sessionStorage.getItem('login_user')!=null) {
                        xhr.setRequestHeader('BasicAuthUsername', user.userId);
                    }
                }
            }).fail(function (error) {
                console.error(error);
                dia.alert('Message', 'Please check your network.', ['OK'], 'fail', function (title) {

                });
                fail('Please check your network.');
            }).done(function (response) {
                console.log('POST Response: %o', response);
                console.assert(response.code != null, '返回数据没有code字段');
                console.assert(response.msg != null, '返回数据没有msg字段');
                console.assert(response.data != null, '返回数据没有data字段');
                success(response);
            });
        },

        //url超链接方式跳转，主要用在文件的下载
        location: function (url,parameters){
            var rparms = removeEmptyvalueJson(parameters);

            // 链接参数到url
            var full_url = url_base + url + "?";
            var i = 0;
            $.each(rparms, function (key, value) {
                if (i == 0) {
                    full_url += key + "=" + value;
                } else {
                    full_url += "&" + key + "=" + value;
                }
            });
            window.location=full_url;
        }
    };

    function _logout(){
        var user = JSON.parse(sessionStorage.getItem('login_user'));

        if(!user){
            sessionStorage.clear();
            return true;
        }

        net.post('user/logoffConsoleUser', {userId : user.userId}, function(){
            //
        }, function(reponse){
            //if(reponse.code == 0){
                sessionStorage.clear();
            //    dia.alert('Message', reponse.msg, ['OK'], 'success', function(){
                    window.location.replace('../index.html');
            //    });
            //} else {
            //    dia.alert('Oops!', reponse.msg, ['OK'], 'fail', function(){});
            //}
        });
    }


    var keep = (function($){
        var user = JSON.parse(sessionStorage.getItem('login_user')),
            lastOperationTime = new Date().getTime(),
            onlineInt = null,
            data = {};

        data.userId = user && user.userId ? user.userId : null;

        function _keepOnlinePoll(){
            if((new Date().getTime() - lastOperationTime) >= 30 * 60 * 1000){
                //客户端处于非活动状态超过30分钟，客户端自动退出
                clearInterval(onlineInt);
                _logout();
                return false;
            }

            data.time = lastOperationTime + '';
            net.post('user/updateAutoOpttime',data, function(){
                clearInterval(onlineInt);
            }, function(response){
                if(response.code != '0' || response.data.result !== true){
                    clearInterval(onlineInt);
                    dia.alert('Oops!', response.msg, ['OK'], 'fail', function(){
                        _logout();
                    });
                }
            });
        }

        $('document').ready(function(){
            if(user && user.userId){
                _keepOnlinePoll();
                onlineInt = setInterval(_keepOnlinePoll, 60 * 1000);

                $(this).on('keydown mousemove mousedown', function(e){
                    //if(e.timeStamp - lastOperationTime >= 30 * 60 *1000) {
                    if(new Date().getTime() - lastOperationTime >= 30 * 60 *1000) {
                        clearInterval(onlineInt);
                        //两次客户端操作时间大于等于30分钟，客户端退出
                        _logout();
                    }

                    //lastOperationTime = e.timeStamp;//e.timeStamp 属性IE不支持，以Gecko内核的Firefox中返回的不是1970至今的毫秒数（7位数的整数? why?）
                    lastOperationTime = new Date().getTime();
                });
            }
        });
        return {};
    })($);

    $(document).ready(function(){
        $('#log_off').unbind().click(function(){
            _logout();
        });
    });

    return net;
});



