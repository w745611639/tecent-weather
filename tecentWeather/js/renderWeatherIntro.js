(function (root) {
	function renderWeatherIntro (data) {
		updateTime(data.air.update_time);   // 更新来源时间
		updateAriRegime(data.air) 			// 更新空气质量状态
		updateObserve(data.observe)			// 更新天气简介
	}
	function updateTime (time) {
		var oTime = document.querySelector('.origin');		
		oTime.innerHTML = `中央气象台 ${root.pickTime(time, -4, 4)} 发布`;
	}
	function updateAriRegime (air) {
		var oPollute = document.querySelector('.pollute');
		oPollute.innerHTML = `
			<i class="poll-btn"></i>
			<span class="poll-num">${air.aqi}</span>
			<span class="poll-degree">${air.aqi_name}</span>`
	}
	function updateObserve (observe) {
		var oWeather_short = document.querySelector('.weather-short');
		html = `
			<img src="./images/s-02.png" alt="" width="175" height="175">
			<div class="weather-des">
				<p class="tem-air">
					<span class="temperature">${observe.degree}°</span>
					<span class="air">${observe.weather}</span>
				</p>
				<p class="wind-humidity-pressure">
					<span class="wind">
						<i class="wind-btn"></i>
						<span class="word">北风 ${observe.wind_power}级</span>
					</span>
					<span class="humidity">
						<i class="humidity-btn"></i>
						<span class="word">湿度 ${observe.humidity}%</span>
					</span>
					<span class="pressure">
						<i class="pressure-btn"></i>
						<span class="word">气压 ${observe.pressure} hPa</span>
					</span>
				</p>
			</div>
		`;
		oWeather_short.innerHTML = html;
	}
	function judgeWindDirection (direction) {		// 判断风向
		switch (direction) {
			case "1":
				return 
			case "2":
				return 
			case "3":
				return 
			case "4":
				return 
			case "5":
				return 
			case "6":
				return 
			case "7":
				return 
			case "8":
				return 
			default: 
				return 
		}
	}
	function chooseDesImage (code) {			// 根据code 选择对应的天气简介图片
		switch (code) {
			case "01": 
				return
			case "01": 
				return
			case "01": 
				return
			case "01": 
				return
			case "01": 
				return
			case "01": 
				return
			case "01": 
				return
			case "01": 
				return
			case "01": 
				return
			default: 
				return
		}
	}
	root.renderWeatherIntro = renderWeatherIntro;
}(window.weather || (window.weather = {})))
