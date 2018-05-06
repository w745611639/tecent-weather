/* 点击城市按钮 出现城市列表
	点击对应城市，发送ajax 请求， 获取数据
	 渲染天气数据
*/
(function (root) {
	function pickTime (time, start, len) {
		var reg = /(?=\d{2}$)/; // 匹配结尾是两个数字的空
		return time.substr(start, len).split(reg).join(':');
	}
	root.pickTime = pickTime;
	root.transitionEvent = whichTransitionEvent();
}(weather))
weather.getData();
function bindEvent() {
	var SearchBtn = document.querySelector('.top .search'),
		oLive_rightBtn = document.querySelector('.live-index .r-btn'),
		oLive_leftBtn = document.querySelector('.live-index .l-btn'),
		oWea_for_1h = document.querySelector('.wea-show .wrap-forecast-1h'),
		oSearch_input = SearchBtn.querySelector('.search-bar input'),
		oHidden = SearchBtn.querySelector('.hidden'),
		oMove_city = oHidden.querySelector('.hot-city'),
		oMatch = document.querySelector('.c-match'),
		Ocity = document.querySelector('.l-m-city'),
		pro_city = document.querySelector('.pro-city-c'),
		maxLeft = oWea_for_1h.offsetWidth - 1250,
	// oLive_flag用于控制是否可以滑动    都为true 可以向右滑动，都为false可以向左滑动
		oLive_flag = [true, true],     
					
		oLive_ul = document.querySelector('.live-show ul'),
		oLive_left = parseInt(getStyle(oLive_ul).left),
	
		oL_btn = document.querySelector('.left-btn'),
		oR_btn = document.querySelector('.right-btn');

	// 一小时天气预报 点击滑动
	oL_btn.addEventListener('click', function () { 
		var Left = parseFloat(getStyle(oWea_for_1h, null).left); 
		weather.forecastHoursSlide(Left < 0, 1250);		
	}, false); 
	oR_btn.addEventListener('click', function () {
		var Left = parseFloat(getStyle(oWea_for_1h, null).left);	
		weather.forecastHoursSlide(Left > -maxLeft, -1250);
	}, false); 


	// 生活指数 运动
	oLive_rightBtn.addEventListener('click', function () {
		changePositionLeft(oLive_ul, -400, oLive_flag, false);
	}, false);
	oLive_leftBtn.addEventListener('click', function () {
		changePositionLeft(oLive_ul, 400, oLive_flag, true);
	}, false);

	// 点击城市区域，展示列表城市信息
	SearchBtn.addEventListener('click', function (event) {
		event.stopPropagation();
		var oHidden = document.querySelector('.hidden');
		oHidden.style.display = 'block';
	}, false);

	// 点击页面其他区域 隐藏城市列表
	document.addEventListener('click', function () {
		var oHidden = document.querySelector('.hidden');
		oHidden.style.display = 'none';
	}, false);


	// 搜索城市，下拉列表展示 ， 防抖
	oSearch_input.addEventListener('input', (function (handle, wait) {    
		var timer = null;
		return function () {
			var _this = this;
			clearTimeout(timer);
			timer = setTimeout(function () {
				handle.call(_this);
			}, wait) 
		}
	}(function () {   // --> 筛选目标城市
		// oMatch.style.display = 'none';
		var oScript = document.createElement('script');
		console.log(22);
		oScript.src = 'https://wis.qq.com/city/like?source=pc&city=' + this.value + '&callback=weather.renderCityList';   // --> 筛选城市
		document.body.appendChild(oScript);
		oScript.remove();
	}, 1000)), false);

	// 点击下拉列表城市，获取对应的城市天气并渲染

	oMatch.addEventListener('click', function (e) {    // --> 点击下拉列表的城市，发送对应的城市数据，取得对应的天气数据
		e.stopPropagation();
		var arr = e.target.innerText.split(','),
			str = '',
			oScript;
		if(arr[1]) {
			oScript = document.createElement('script');
			arr[2] = arr[2] ? arr[2] : '';
			if(arr[2]) {
				oScript.src =  'https://wis.qq.com/weather/common?source=pc&weather_type=observe%7Cforecast_1h%7Cforecast_24h%7Cair%7Cindex&province=' + arr[0] + '&city=' + arr[1] + '&county=' + arr[2] + '&callback=weather.renderWeatherData'; 
				str += arr[1] + arr[2];
			} else {
				oScript.src =  'https://wis.qq.com/weather/common?source=pc&weather_type=observe%7Cforecast_1h%7Cforecast_24h%7Cair%7Cindex&province=' + arr[0] + '&city=' + arr[1] + '&county=&callback=weather.renderWeatherData';
				str += arr[0] + arr[1];
			}	
			document.body.appendChild(oScript);
			oScript.remove();
			pro_city.innerHTML = str;
		}
		oSearch_input.value = '';
		oHidden.style.display = 'none';
		this.style.display = 'none';
		Ocity.style.display = 'block';
	}, false);

	// 点击热门城市，渲染对应的城市天气
	oMove_city.addEventListener('click', function (event) {
		event.stopPropagation();
		event.preventDefault();
		if(event.target && event.target.nodeName === 'A') {
			var province = event.target.getAttribute('data-province');
			var city = event.target.innerHTML;
			weather.getData(province, city);
			oHidden.style.display = 'none';
			if(province === city)  {
				pro_city.innerHTML = province + ' ' + city;
			} else  {
				pro_city.innerHTML = province + '省 ' + city;
			}
			
		}
	}, false)


	// 生活指数运动函数
	function changePositionLeft(obj, change, arr, boolean) {
		if(arr.indexOf(boolean) === -1) {   
			arr[0] = boolean;
			oLive_left += change;
			obj.style.left = oLive_left + 'px';
			bindTransitionEvent(weather.transitionEvent, obj, function () {
				arr[1] = boolean;
			});
		}
	}
}
bindEvent();