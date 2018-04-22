var managerSpace = {};
(function (global, part ) {      //--->  ÓÃÒ»¸öÁ¢¼´Ö´ÐÐº¯Êý£¬·ÀÖ¹È«¾Ö±äÁ¿ÎÛÈ¾
	var oSearch = document.querySelector('.search'),
		oHidden = oSearch.querySelector('.hidden'),
		oInp = oHidden.querySelector('input'),
		Ocity = oHidden.querySelector('.l-m-city'),
		oMatch = oHidden.querySelector('.c-match'),
		pro_city = document.querySelector('.pro-city-c'),
		oL_btn = document.querySelector('.left-btn'),
		oR_btn = document.querySelector('.right-btn'),
		oLive_r_btn = document.querySelector('.r-btn'),
		oLive_l_btn = document.querySelector('.l-btn'),
		oLive_control_l = document.querySelector('.contro-l'),
		oLive_control_r = document.querySelector('.contro-r'),
		oLive_show = document.querySelector('.live-show'),
		oLive_ul = oLive_show.querySelector('ul'),
		oLive_maxLeft = oLive_ul.offsetWidth - 400,
		oLive_left = parseFloat(getStyle(oLive_ul, null).left),
		oWea = document.querySelector('.wea-show ol'),
		Left = parseFloat(getStyle(oWea, null).left),
		maxLeft = oWea.offsetWidth - 1250,
		transitionEvent = whichTransitionEvent(),
		flag = true,
		oLive_flag = [true, true];
	part.dealData = function (json) {    	// --> partÖ¸ÏòmanagerSpace£¬¶¨ÒådealData·½·¨£¬ÓÃÀ´´¦Àí»ñÈ¡µÄjsonpÊý¾Ý(ÓÃÓÚË¢Ñ¡,Ñ¡Ôñ³ÇÊÐ)
		var str = '',
			data = json.data,
			value = oInp.value,
			replaceValue = '<span>' + value + '</span>',
			reg = new RegExp('(' + value + ')', 'g'),
			temp,
			prop;
		Ocity.style.display = 'none';	
		for(prop in data) {
			if(data.hasOwnProperty(prop)) {
				temp = data[prop].replace(reg, replaceValue);
				str += '<li>' + temp +'</li>';
			}
		}
		oMatch.innerHTML = str;
	};
	part.renderData =  function (json) {       // -- > äÖÈ¾ÌìÆøÇé¿ö·½·¨
		var poll_num = document.querySelector('.poll-num'),
			poll_degree = document.querySelector('.poll-degree'),		
			oOrigin = document.querySelector('.origin'),
			forecast_1h = json.data['forecast_1h'];
		poll_num.innerHTML =  json.data.air.aqi;     //    ¿ÕÆø×´¿ö
		poll_degree.innerHTML = json.data.air['aqi_name'];  // ¿ÕÆø×´¿ö
		oOrigin.innerHTML = 'ÖÐÑëÆøÏóÌ¨ ' + part.addTime(json.data.observe['update_time'].slice(-4), 2, ':') + '·¢²¼';
		console.log(json);		
		renderLiveData(json);
		renderForecastHours(json);
		renderForecastDays(json);
		renderObserve(json);		
	};	
	part.addTime = function (str, index, joins) {
		var tempArr = str.split('');
		tempArr.splice(index, 0 , joins);
		return tempArr.join('');
	};
	part.init = function () {
		var script = document.createElement('script');
		script.src = 'https://wis.qq.com/weather/common?source=pc&weather_type=observe%7Cforecast_1h%7Cforecast_24h%7Cair%7Cindex&province=ºþÄÏÊ¡&city=ºâÑôÊÐ&county=ºâÑôÏØ&callback=managerSpace.renderData';
		document.body.appendChild(script);
		script.remove();
	}
	function renderLiveData(json) {      			// ---> äÖÈ¾Éú»îÏà¹ØµÄÊý¾Ý
		var liv_ul = document.querySelector('.live-show ul'),
		// var liv_ul = document.getElementsByClassName('live-show')[0].getElementsByTagName('ul')[0],
			arr =  ['umbrella', 'clothes', 'sunscreen', 'cold', 'sports',
					'carwash', 'fish', 'traffic', 'diffusion', 'makeup',
					'heatstroke', 'comfort', 'mood', 'tourism', 'ultraviolet',
					'allergy'
					],
			index = json.data.index,
			temp = null,
			obj = null,
			str = '',
			i,
			length = arr.length;
		for(i = 0; i < length; i ++) {
			temp = arr[i];
			obj = index[temp];
			str += '\
				<li class="item">\
					<div class="liv-in">\
						<i class="' + temp + '"></i>\
						<p>' + obj.name + ' ' + obj.info + '</p>\
						<div class="detail">' + obj.detail + '</div>\
					</div>\
				</li>';
		}
		liv_ul.innerHTML = str;
	}
   
   	function renderForecastHours (json) {    // --> 1Ð¡Ê±Ô¤±¨
   		var forecast_1h = json.data.forecast_1h,
   			str = '',
   			temp = null,
   			prop;
   		for(prop in forecast_1h) {
   			if(forecast_1h.hasOwnProperty(prop)) {
   				temp = forecast_1h[prop];
   				str += '\
   						<li class="item">\
   							<p>' + part.addTime(temp.update_time.slice(8, 12), 2, ':') + '</p>\
   							<img src="./images/00.png">\
   							<p class="degree">' + temp.degree + '¡ã</p>\
   						</li>';
   			}
   		}
   		oWea.innerHTML = str;
   	}

   	function renderForecastDays(json) {
   		var oSeven = document.querySelector('.seven-wea ol'),
   			str = '',
   			forecast_24h = json.data.forecast_24h,
   			temp = null,
   			prop;
   		for(prop in forecast_24h) {
   			if(forecast_24h.hasOwnProperty(prop)) {
   				temp = forecast_24h[prop];
   				str += '\
   						<li>\
							<div class="day-time">\
								<p class="day">ÃûÌì</p>\
								<p class="date">12/13</p>\
								<p class="s-weather">' + temp.day_weather +'</p>\
								<img src="./images/07.png" alt="">\
								<p class="temperature">' + temp.max_degree + '¡ã</p>\
							</div>\
							<div class="night-time">\
								<p class="temperature">' + temp.min_degree + '¡ã</p>\
								<img src="./images/07.png" alt="">\
								<p class="s-weather">' + temp.night_weather + '</p>\
								<p class="wind-direc">' + temp.night_wind_direction + '</p>\
								<p class="level">' + temp.night_wind_power + '¼¶</p>\
							</div>\
						</li>';
   			}
   		}
   		oSeven.innerHTML = str;
   	}

   	function renderObserve (json) {
   		var oWea_des = document.querySelector('.weather-des'),
   			str = '',
   			observe = json.data.observe;
		str = '\
				<p class="tem-air">\
					<span class="temperature">' + observe.degree + '¡ã</span>\
					<span class="air">' + observe.weather + '</span>\
				</p>\
				<p class="wind-humidity-pressure">\
				 	 	<span class="wind">\
				 	 	<i class="wind-btn"></i>\
				 	 	<span class="word">±±·ç ' + observe.wind_power + '¼¶</span>\
				 	 </span>\
				 	<span class="humidity">\
				 		<i class="humidity-btn"></i>\
				 		<span class="word">Êª¶È ' + observe.humidity + '%</span>\
				 	</span>\
					<span class="pressure">\
				 		<i class="pressure-btn"></i>\
				 		<span class="word">ÆøÑ¹ ' + observe.pressure + 'hPa</span>\
				 	</span>\
				</p>';
		oWea_des.innerHTML = str;
   	}

   

	oSearch.addEventListener('click', function (e) {   // --> µã»÷³öÏÖ³ÇÊÐËÑË÷¿ò
		e.stopPropagation();
		oHidden.style.display = 'block';
		document.onclick = function () {
			oHidden.style.display = 'none';
		}
	}, false);

	oInp.addEventListener('input', (function (handle, wait) {    // --> ³ÇÊÐËÑË÷¿òinputÊÂ¼þ£¬²éÕÒÓëvalueÖµÆ¥ÅäµÄ³ÇÊÐ£¬²¢äÖÈ¾³öÀ´
		var timer = null;
		return function () {
			var _this = this;
			clearTimeout(timer);
			timer = setTimeout(function () {
				handle.call(_this);
			}, wait) 
		}
	}(function () {   // --> »ñÈ¡³ÇÊÐÊý¾Ýº¯Êý
		// oMatch.style.display = 'none';
		var oScript = document.createElement('script');
		oScript.src = 'https://wis.qq.com/city/like?source=pc&city=' + this.value + '&callback=managerSpace.dealData';   // --> »ñÈ¡³ÇÊÐµÄ jsonp½Ó¿Ú
		document.body.appendChild(oScript);
		oScript.remove();
	}, 1000)), false);

	oMatch.addEventListener('click', function (e) {    // --> µã»÷ÏÂÀ­ÁÐ±íµÄ³ÇÊÐ,»ñÈ¡¶ÔÓ¦ÌìÆøÐÅÏ¢
		e.stopPropagation();
		var arr = e.target.innerText.split(','),
			str = '',
			oScript;
		if(arr[1]) {
			oScript = document.createElement('script');
			arr[2] = arr[2] ? arr[2] : '';
			if(arr[2]) {
				oScript.src =  'https://wis.qq.com/weather/common?source=pc&weather_type=observe%7Cforecast_1h%7Cforecast_24h%7Cair%7Cindex&province=' + arr[0] + '&city=' + arr[1] + '&county=' + arr[2] + '&callback=managerSpace.renderData';  //--->»ñÈ¡¾ßÌåÌìÆøÇé¿öµÄjsonp½Ó¿Ú
				str += arr[1] + arr[2];
			} else {
				oScript.src =  'https://wis.qq.com/weather/common?source=pc&weather_type=observe%7Cforecast_1h%7Cforecast_24h%7Cair%7Cindex&province=' + arr[0] + '&city=' + arr[1] + '&county=&callback=managerSpace.renderData';
				str += arr[0] + arr[1];
			}	
			document.body.appendChild(oScript);
			oScript.remove();
			pro_city.innerHTML = str;
		}
		oInp.value = '';
		oHidden.style.display = 'none';
		this.style.display = 'none';
		Ocity.style.display = 'block';
	}, false);


 // ÌìÆøÐ¡Ê±Ô¤±¨»¬¶¯ÃÅ
	oL_btn.addEventListener('click', function () {  
		forecastHoursSlide(Left < 0, 1250);		
	}, false); 
	oR_btn.addEventListener('click', function () {	
		forecastHoursSlide(Left > -maxLeft, -1250);
	}, false); 
	function forecastHoursSlide(condition, num) {
		if(flag && condition) {
			flag = false;
			Left += num;
			if(num < 0) {
				Left = Math.max(-maxLeft, Left);
			} else {
				Left = Math.min(0, Left);
			}
			oWea.style.left = Left + 'px';
			bindTransitionEvent(oWea, function () {
				flag = true;
			});
		}
	}
// Éú»îÖ¸ÊýÇøÓò»¬¶¯ÃÅ
	oLive_l_btn.addEventListener('click', function () {
		changePositionLeft(oLive_ul, 400, oLive_flag, true);
	}, false); 

	oLive_r_btn.addEventListener('click', function () {
		changePositionLeft(oLive_ul, -400, oLive_flag, false);
	}, false);

	oLive_control_l.addEventListener('click', function () {
		changePositionLeft(oLive_ul, 400, oLive_flag, true);
	}, false);

	oLive_control_r.addEventListener('click', function () {
		changePositionLeft(oLive_ul, -400, oLive_flag, false);
	}, false);  

	function changePositionLeft(obj, change, arr, boolean) {
		if(arr.indexOf(boolean) === -1) {   
			arr[0] = boolean;
			oLive_left += change;
			obj.style.left = oLive_left + 'px';
			bindTransitionEvent(obj, function () {
				arr[1] = boolean;
			});
		}
	}

	function bindTransitionEvent(obj, callback) {
		obj.addEventListener(transitionEvent, function () {
			callback();
			this.removeEventListener(transitionEvent, arguments.callee, false);
		})
	}
}(this, managerSpace));
