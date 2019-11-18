$(function() {
	var defaultConfig = {tabwq_bg_color: 'white'}; // 默认配置
	chrome.storage.local.get(defaultConfig, function(items) {
		document.body.style.backgroundColor = items.tabwq_bg_color;
	});
	// $('#test_hello').html("helloWorld");
});

function callInfo(date){
    chrome.runtime.sendMessage(date, function(response){
	    // console.log('callInfo: ' + response);
    	$('#tabsInfo').html('')
    	if (response==null) {$('#tabsInfo').html('empty');return;}
    	JSON.parse(response).forEach(function(item){
    		$('#tabsInfo').append('<li><a href="'+item.u+'">'+item.tt+'</a></li>')
    	})

	});
}

$(document).on("click",'#tabsKey li',function(){
	callInfo(""+this.innerText) 
});

$('#open_tabs_date').click(e => {
	// var bg = chrome.extension.getBackgroundPage();
	// alert(bg.document.title);
	// var kvs = localStorage['tabs'] = JSON.stringify(arr);
	/*chrome.storage.local.get(['tabs'], function(result) {
    	console.log('Value currently is ' + result.key);
    	$('#tabsKey').html(result)
	});*/
	chrome.runtime.sendMessage('tabs', function(response){
	    // console.log('Value currently is ' + response);
    	$('#tabsKey').html('')
    	response.forEach(function(item){$('#tabsKey').append('<li><a href="#">'+item+'</a></li>')})
	});
	/*var user1 = {'name': 'diego', 'age': 18}
	chrome.storage.sync.set({'user1': user1}, function() {
	    console.log('保存成功');
	});
	chrome.storage.sync.get('user1', function(result) {});*/
});


$('#clear_tabs_date').click(e => {
	chrome.runtime.sendMessage('clear', function(response){
	    console.log('clear status: ' + response);
	});
});

$('#download_tabs').click(e => {
	chrome.runtime.sendMessage('download', function(response){
	    console.log('download status: ' + response);
	});
});

$('#change_bg').click(e => {
	colors=['aqua','fuchsia','gray','green','lime','maroon','navy','olive','purple','silver','teal','white','yellow']
	var color = colors[Math.floor((Math.random()*colors.length))];
	console.log(color)
	chrome.storage.local.set({tabwq_bg_color: color}, function() {
		document.body.style.backgroundColor = color;
	});
});

