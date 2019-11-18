function Base64() {
 
    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
 
    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }
 
    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }
 
    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
        return utftext;
    }
 
    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}

Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

var main = {
    queue: [],

	saveTabs: function(){
		chrome.tabs.query({}, function(foundTabs) {
	        var tabsCount = foundTabs.length;
	        var arr = new Array();
	        for(var i=0;i<foundTabs.length;i++){
	        	var link = {"u":foundTabs[i].url, "tt":foundTabs[i].title}
	        	arr.push(link)
	        	// console.log(foundTabs[i].url + "---" + foundTabs[i].title);
	        }
	        // localStorage['tabs'] = JSON.stringify(arr);
			var result = JSON.stringify(arr);
            var sufKey = (new Date()).format("yyyyMMddhhmm");
            if (main.queue.length==24) {
                var key=main.queue.pop();
                chrome.storage.local.remove(key, function() {console.log('removed');});
            }
            var ss ={};
            ss[sufKey]=result;
            chrome.storage.local.set(ss, function() {
                console.log('saved');
            });
            main.queue.unshift(sufKey);
            chrome.storage.local.remove("tabs", function(){});
            // chrome.storage.sync.clear(function(){});
            chrome.storage.local.set({"tabs": main.queue}, function() {
                console.log('save list');
            });
			
			/*var url = 'data:application/json;base64,' + new Base64().encode(result);
			var suf = (new Date()).format("yyyyMMddhhmm");
	        chrome.downloads.download({
			        url: url,
			        filename: 'tabswq_'+suf+'.json'
			});*/

        });
	},
    /*fn: function() {
        var exp = this;
        exp.saveTabs();
        clearInterval(this.timerVar);
        this.timerVar = setInterval(this.saveTabs, 3600*1000);
    },
	start: function(){
        this.timerVar = setInterval(this.fn, 20*1000);
		// setInterval(this.saveTabs,3600*1000);
	},*/
	init: function(){
		_this = this;
        chrome.storage.local.get("tabs", function(result) {
            localqueue=result.tabs;
            if (localqueue != null && localqueue.length>0) {
                main.queue=localqueue;
            }
        });
		// this.saveTabs();
        /*chrome.storage.local.get(null, function(items) {
		    var result = JSON.stringify(items);
		    var url = 'data:application/json;base64,' + btoa(result);
		    chrome.downloads.download({
		        url: url,
		        filename: 'filename_of_exported_file.json'
		    });
		});*/

	},
	create: function(){
		var _html = '<div id="info_area">'+
			'<h3>TabsQW!</h3>'+
			'<div id="ls_list">loading...</div>'+
			'<div id="ls_form">'+
				'<label> add: </label>'+
				'<input type="text" id="link_new" />'+
				'<button id="ls_save">Save</button>'+
			'</div>'+
		'</div>';
		$('body').append(_html);
	},

    onMessageListener: function(message, sender, sendResponse){
        /*function runAsync(message, sender){
            var defer = $.Deferred();
            setTimeout(function(){
                alert(message)
                if(message == 'tabs'){
                    defer.resolve(main.queue.slice());
                }else{
                    chrome.storage.local.get(message, function(result) {
                        msg=result[message];
                        defer.resolve(msg)
                    });
                }
            }, 1000);
            alert(JSON.stringify(defer))
            return defer.promise();
        }
        sendResponse(runAsync(message, sender))*/
        /*let retdd = new Promise((message, sender) => {
            if(message == 'tabs'){
                    resolve(main.queue.slice());
                }else{
                    chrome.storage.local.get(message, function(result) {
                        msg=result[message];
                        resolve(msg)
                    });
                }
        });
        Promise.all([retdd]).then((res) =>{alert(JSON.stringify(res));sendResponse(res)})
        return true*/

        /*runAsync(message, sender).then(function(data){
            sendResponse(data);
        });*/
        if(message == 'tabs'){
            sendResponse(main.queue.slice());
        }else if(message == 'clear'){
            main.queue=[]
            chrome.storage.local.clear(function(){});
            sendResponse("ok");
        }else if(message == 'download'){
            if(main.queue.length==0){
                sendResponse("no history currently");
            }else{
                var key = main.queue[0]
                chrome.storage.local.get(key, function(result) {
                    msg=result[key];
                    var url = 'data:application/json;base64,' + new Base64().encode(msg);
                    var suf = (new Date()).format("yyyyMMddhhmm");
                    chrome.downloads.download({
                            url: url,
                            filename: 'tabswq_'+suf+'.json'
                    });
                });
            }
            sendResponse("ok");
        }else{
            /*var msg;
            chrome.storage.local.get(message, function(result) {
                msg=result[message];
                alert(result)
            });
            sendResponse(msg);*/
            new Promise(function(resolve, reject){
                chrome.storage.local.get(message, function(result) {
                    msg=result[message];
                    // if(msg==null) msg=[]
                    resolve(msg)
                });
                // resolve(value);
            }).then((data)=> sendResponse(data));
            return true
        }
        return true
    }
}




main.init();
function fn() {
    main.saveTabs();
    clearInterval(timerVar);
    timerVar = setInterval(main.saveTabs, 60*1000);
};
var timerVar = setInterval(fn, 30*1000);
chrome.runtime.onMessage.addListener(main.onMessageListener);

