var oSea = document.getElementsByClassName('top')[0].getElementsByClassName('search')[0];
var oHidden = oSea.getElementsByClassName('hidden')[0];
var oInp = oHidden.getElementsByTagName('input')[0];
var local_btn = document.getElementsByClassName('local-btn')[0];
var pro_city = document.getElementsByClassName('pro-city-c')[0];
var Mcity = oHidden.getElementsByClassName('more-city')[0];
var Ocity = oHidden.getElementsByClassName('l-m-city')[0];
var oMatch = oHidden.getElementsByClassName('c-match')[0];
var maxHeight = Mcity.offsetHeight;

oSea.onclick = function (e) {
	e.stopPropagation();
	oHidden.style.display = 'block';
	document.onclick = function () {
		oHidden.style.display = 'none';
	}
}

oInp.oninput = getCity(getData,1000);
function getCity(handle, wait) {
	var timer = null;
	return function () {
		clearTimeout(timer);
		var _this = this;
		timer = setTimeout(function () {
			handle.apply(_this);
		}, wait) 
	}
}
function getData() {
	var oScript = document.createElement('script');
	oScript.src = 'https://wis.qq.com/city/like?source=pc&city=' + this.value +'&callback=dealData';
	document.body.appendChild(oScript);
	oScript.remove();
}
function dealData(json) {
	var str = '';
	var data = json.data;
	var value = oInp.value;
	var replaceValue = '<span>' + value + '</span>';
	var reg = new RegExp('(' + value + ')', 'g');
	var temp;
	Ocity.style.display = 'none';
	for(var prop in data) {
		if(data.hasOwnProperty(prop)) {
			temp = data[prop].replace(reg, replaceValue);
			str += '<li>' + temp +'</li>';
		}
	}
	oMatch.innerHTML = str;
}
oMatch.onclick = function (e) {
	e.stopPropagation();
	var arr = e.target.innerText.split(','),
		str = '';
	if(arr[1]) {
		var oScript = document.createElement('script');
		arr[2] = arr[2] ? arr[2] : '';
		if(arr[2]) {
			oScript.src =  'https://wis.qq.com/weather/common?source=pc&weather_type=observe%7Cforecast_1h%7Cforecast_24h%7Cair%7Cindex&province=' + arr[0] + '&city=' + arr[1] + '&county=' + arr[2] + '&callback=renderData';
			str += arr[1] + arr[2];
		} else {
			oScript.src =  'https://wis.qq.com/weather/common?source=pc&weather_type=observe%7Cforecast_1h%7Cforecast_24h%7Cair%7Cindex&province=' + arr[0] + '&city=' + arr[1] + '&county=&callback=renderData';
			str += arr[0] + arr[1];
		}	
		document.body.appendChild(oScript);
		oScript.remove();
		pro_city.innerHTML = str;
	}
	oHidden.style.display = 'none';
}
function renderData(json) {
	var poll_num = document.getElementsByClassName('poll-num')[0];
	var poll_degree = document.getElementsByClassName('poll-degree')[0];
	var wea_show = document.getElementsByClassName('wea-show')[0];
	var oItem_1h = document.getElementsByClassName('forecast-hours')[0].getElementsByClassName('item');
	var live_show = document.getElementsByClassName('live-show')[0];
	var length = oItem_1h.length;
	var forecast_1h = json.data['forecast_1h'];
	poll_num.innerHTML =  json.data.air.aqi;     //    空气状况
	poll_degree.innerHTML = json.data.air['aqi_name'];  // 空气状况
	changeContent(wea_show, 'p', forecast_1h);
}
function changeContent(con,target, data) {
	var obj = con.getElementsByTagName(target);
	var arr = [];
	for(var i = 0, length = obj.length; i < length; i ++) {
		arr.push(obj[i]);
	}
	arr.forEach(function (ele, index) {
		ele.innerHTML = addData(data[index], 'update_time');
	})
}
function addData(data, prop) {
	return data[prop].substr(8,2) + ':00';
}
// 优化方案
// var managerData = {
// 	init: function () {
// 		this.forecastHours();
// 		this.forecastSevenDay();
// 		this.liveLevel();
// 		this.weatherShort();
// 	},
// 	forecastHours: function () {
// 		var oItem_1h = document.getElementsByClassName('forecast-hours')[0].getElementsByClassName('item');
// 		for(var i = 0, length = oItem_1h.length; i < length; i ++) {
// 			obj['forecast_1h']['p'][i] = oItem_1h[i].getElementsByTagName('p')[0];
// 			obj['forecast_1h']['img'][i] = oItem_1h[i].getElementsByTagName('img')[0];
// 		}
// 	},
// 	forecastSevenDay: function () {
// 		console.time(1);
// 		var oItem_24h = document.getElementsByClassName('seven-rep')[0].getElementsByClassName('item');
// 		for(var i = 0, length = oItem_24h.length; i < length; i ++) {
// 			obj['forecast_24h']['day_time']['day'][i] = oItem_24h[i].getElementsByClassName('day-time')[0].getElementsByClassName('day')[0];
// 			obj['forecast_24h']['day_time']['date'][i] = oItem_24h[i].getElementsByClassName('day-time')[0].getElementsByClassName('date')[0];
// 			obj['forecast_24h']['day_time']['weather'][i] = oItem_24h[i].getElementsByClassName('day-time')[0].getElementsByClassName('s-weather')[0];
// 			obj['forecast_24h']['day_time']['img'][i] = oItem_24h[i].getElementsByClassName('day-time')[0].getElementsByTagName('img')[0];
// 			obj['forecast_24h']['night_time']['img'][i] = oItem_24h[i].getElementsByClassName('night-time')[0].getElementsByTagName('img')[0];
// 			obj['forecast_24h']['night_time']['weather'][i] = oItem_24h[i].getElementsByClassName('night-time')[0].getElementsByClassName('s-weather')[0];
// 			obj['forecast_24h']['night_time']['wind_direc'][i] = oItem_24h[i].getElementsByClassName('night-time')[0].getElementsByClassName('wind-direc')[0];
// 			obj['forecast_24h']['night_time']['level'][i] = oItem_24h[i].getElementsByClassName('night-time')[0].getElementsByClassName('level')[0];
// 		}
// 		console.timeEnd(1);
// 	},
// 	liveLevel: function () {

// 	},
// 	weatherShort: function () {


// 	}
// };
// var obj = {
// 	forecast_1h: {
// 		p: {},
// 		img: {}
// 	},
// 	forecast_24h: {
// 		day_time: {
// 			day: {},
// 			date: {},
// 			weather: {},
// 			img: {}
// 		},
// 		night_time: {
// 			img: {},
// 			weather: {},
// 			wind_direc: {},
// 			level: {}
// 		}	
// 	},
// 	index: {
// 		allergy: {},

// 	}
// };
// managerData.init();