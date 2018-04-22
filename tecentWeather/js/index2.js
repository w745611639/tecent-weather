var managerSpace = {};
(function (global, part ) {      //---> 立即执行函数，防止全局污染
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
		oWea_for_1h = document.querySelector('.wea-show .wrap-forecast-1h'),
		Left = parseFloat(getStyle(oWea_for_1h, null).left),
		maxLeft = oWea_for_1h.offsetWidth - 1250,
		transitionEvent = whichTransitionEvent(),
		flag = true,
		oLive_flag = [true, true];
	part.dealData = function (json) {    	// --> 搜索城市，根据input.value 值来筛选目标城市 
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
		console.log(json);
		oMatch.innerHTML = str;
		oMatch.style.display = 'block';
	};
	part.renderData =  function (json) {       // -- > 将目标城市天气数据渲染
		var poll_num = document.querySelector('.poll-num'),
			poll_degree = document.querySelector('.poll-degree'),		
			oOrigin = document.querySelector('.origin'),
			forecast_1h = json.data['forecast_1h'];
		poll_num.innerHTML =  json.data.air.aqi;     //    空气质量
		poll_degree.innerHTML = json.data.air['aqi_name'];  // 污染程度
		oOrigin.innerHTML = '中央气象台 ' + part.addTime(json.data.observe['update_time'].slice(-4), 2, ':') + '发布';
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
	function renderLiveData(json) {      			// ---> 生活相关的数据
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
   
   	function renderForecastHours (json) {    // --> 1小时预报
   		var forecast_1h = json.data.forecast_1h,
   			canvas_1h = oWea_for_1h.querySelector('canvas'),
   			str = '',
   			temp = null,
   			prop,
   			degreeArr = []; 	// 将1小时温度数据保存与数组中，用于找出最大/小值，即变化大小;
   		for(prop in forecast_1h) {
   			if(forecast_1h.hasOwnProperty(prop)) {
   				temp = forecast_1h[prop];
   				degreeArr[prop] = +temp.degree;
   				str += '\
   						<li class="item">\
   							<p>' + part.addTime(temp.update_time.slice(8, 12), 2, ':') + '</p>\
   							<img src="./images/00.png">\
   						</li>';
   			}
   		}
   		oWea.innerHTML = str;
   		drawTemperatureChange(canvas_1h, forecast_1h, degreeArr, {
   			attr: 'degree',
   			inial_left: 51,
   			text_top: 25,
   			change_top: 30,
   			area: 10,
   			fill_style: 'rgb(255, 183, 77)'
   		}); 		
   	}
   	// 温度变化曲线函数
   	function drawTemperatureChange(canvasObj, dataObj, attrArr, dataJson, bool) {
   		var ctx = canvasObj.getContext('2d'),
			min_value, 		 	// 存储最高温度
			max_value, 			//存储最低温度
			graded,     		// 存储温度变化量 即 max_value - min_value;
			speed,				// 变化的速度;  speed = area / graded 
			curTop,
			curLeft,
			area = dataJson['area'],			// 变化的最大像素（体现在top上） 
			attr = dataJson['attr'],
			inial_left = dataJson['inial_left'],
			text_top = dataJson['text_top'],
			change_top = dataJson['change_top'],
			curLineTop,
			temp,
			inialArr = foundArea(attrArr);   // 初始化数组（最大值， 最小值，区间）
		max_value = inialArr['max_value'];
		min_value = inialArr['min_value'];
		graded = inialArr['graded'];
		speed = inialArr['speed'] * area;
   		// canvas绘制
   		ctx.font = "22px Microsoft YaHei";
   		ctx.textAlign = 'center';
   		ctx.textBaseline = 'middle';
   		ctx.fillStyle = '#222';
   		ctx.lineWidth = 2;
   		ctx.lineCap = 'round';
   		ctx.strokeStyle = dataJson['fill_style'];
   		if(!bool) {     							// 加个bool判断
   			ctx.clearRect(0, 0, 9999, 9999);     // 清除上一次的绘制曲线
   		}
   		ctx.beginPath();
   		for(prop in dataObj) {
   			if(dataObj.hasOwnProperty(prop)) {
   				temp = dataObj[prop][attr];
   				curLeft =  inial_left + prop * 102;  
   				curTop = text_top + (max_value - temp) * speed;
   				curLineTop = curTop + change_top;
   				ctx.fillText(temp + '°', curLeft, curTop);   	// 绘制温度
   				ctx.lineTo(curLeft, curLineTop);      	// 绘制温度曲线
   				ctx.arc(curLeft, curLineTop, 2, 0, Math.PI * 2);  // 绘制小圆点
   			}
   		}
   		// ctx.closePath();
   		ctx.stroke();
   	}
   	function foundArea(attrArr) {
   		var obj = {}, maxV, minV, tempGr;
   		attrArr.sort(function (a, b) {
   			return a - b;
   		});
   		minV = attrArr[0];
   		maxV = attrArr[attrArr.length - 1];
   		tempGr = maxV - minV;
   		return {
   			'min_value': minV,
   			'max_value': maxV,
   			'graded': tempGr,
   			'speed': tempGr ? 1 / tempGr : 0
   		}
   	}
   	function renderForecastDays(json) {
   		var oSeven = document.querySelector('.seven-wea ol'),
   			canvas_day = document.querySelector('.seven-wea canvas'),
   			str = '',
   			forecast_24h = json.data.forecast_24h,
   			temp = null,
   			maxDegreeArr = [],
   			minDegreeArr = [],
   			prop;
   		for(prop in forecast_24h) {
   			if(forecast_24h.hasOwnProperty(prop)) {
   				temp = forecast_24h[prop];
   				maxDegreeArr[prop] = temp['max_degree']; 
   				minDegreeArr[prop] = temp['min_degree']; 
   				str += '\
   						<li>\
							<div class="day-time">\
								<p class="day">明天</p>\
								<p class="date">12/13</p>\
								<p class="s-weather">' + temp.day_weather +'</p>\
								<img src="./images/07.png" alt="">\
							</div>\
							<div class="night-time">\
								<img src="./images/07.png" alt="">\
								<p class="s-weather">' + temp.night_weather + '</p>\
								<p class="wind-direc">' + temp.night_wind_direction + '</p>\
								<p class="level">' + temp.night_wind_power + '级</p>\
							</div>\
						</li>';
   			}
   		}
   		oSeven.innerHTML = str;
   		drawTemperatureChange(canvas_day, forecast_24h, maxDegreeArr, {
   			attr: 'max_degree',
   			inial_left: 51,
   			text_top: 30,
   			change_top: 35,
   			area: 30,
   			fill_style: 'rgb(255, 183, 77)'
   		});
   		drawTemperatureChange(canvas_day, forecast_24h, minDegreeArr, {
   			attr: 'min_degree',
   			inial_left: 51,
   			text_top: 130,
   			change_top: -35,
   			area: 30,
   			fill_style: 'rgb(100, 181, 246)'
   		}, true);
   	}

   	function renderObserve (json) {
   		var oWea_des = document.querySelector('.weather-des'),
   			str = '',
   			observe = json.data.observe;
		str = '\
				<p class="tem-air">\
					<span class="temperature">' + observe.degree + '°</span>\
					<span class="air">' + observe.weather + '</span>\
				</p>\
				<p class="wind-humidity-pressure">\
				 	 	<span class="wind">\
				 	 	<i class="wind-btn"></i>\
				 	 	<span class="word">北风 ' + observe.wind_power + '级</span>\
				 	 </span>\
				 	<span class="humidity">\
				 		<i class="humidity-btn"></i>\
				 		<span class="word">湿度 ' + observe.humidity + '%</span>\
				 	</span>\
					<span class="pressure">\
				 		<i class="pressure-btn"></i>\
				 		<span class="word">气压 ' + observe.pressure + 'hPa</span>\
				 	</span>\
				</p>';
		oWea_des.innerHTML = str;
   	}

   

	oSearch.addEventListener('click', function (e) {   // --> 添加添加事件 搜索按钮
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
	}(function () {   // --> 筛选目标城市
		// oMatch.style.display = 'none';
		var oScript = document.createElement('script');
		oScript.src = 'https://wis.qq.com/city/like?source=pc&city=' + this.value + '&callback=managerSpace.dealData';   // --> 筛选城市
		document.body.appendChild(oScript);
		oScript.remove();
	}, 1000)), false);

	oMatch.addEventListener('click', function (e) {    // --> 点击下拉列表的城市，发送对应的城市数据，取得对应的天气数据
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


 // 1小时预报滑动门
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
			oWea_for_1h.style.left = Left + 'px';
			bindTransitionEvent(oWea_for_1h, function () {
				flag = true;
			});
		}
	}
// 生活相关滑动
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

	(function () {    //----->> 初始化
		console.log(1111);
		var script = document.createElement('script');
		script.src = 'https://wis.qq.com/weather/common?source=pc&weather_type=observe%7Cforecast_1h%7Cforecast_24h%7Cair%7Cindex&province=湖南省&city=衡阳市&county=衡阳县&callback=managerSpace.renderData';
		document.body.appendChild(script);
		script.remove();
	}());
}(this, managerSpace));
