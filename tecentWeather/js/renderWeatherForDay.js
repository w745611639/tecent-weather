(function (root) {
	// 7天预报渲染
	function renderWeatherForDay (data) {
		var oSeven_rep = document.querySelector('.seven-rep'),
			html = '',
			reg = /-/,
			maxDegreeArr = [],
   			minDegreeArr = [],
   			canvas_day = document.querySelector('.seven-wea canvas'),
   			prop,
   			temp;
		for(prop in data['forecast_24h']) {
				temp = data['forecast_24h'][prop];
			maxDegreeArr[prop] = temp['max_degree'];
			minDegreeArr[prop] = temp['min_degree'];
			html += `
				<li class="item">
					<div class="day-time">
						<p class="day">昨天</p>
						<p class="date">${temp.time.substr(-5).replace(reg, '/')}</p>
						<p class="s-weather">${temp['day_weather_short']}</p>
						<img src="./images/07.png" alt="">     
					</div>
					<div class="night-time">
						<img src="./images/07.png" alt="">
						<p class="s-weather">${temp['night_weather_short']}</p>
						<p class="wind-direc">北风</p>
						<p class="level">${temp['night_wind_power']}级</p>
					</div>
				</li>
			`
		}
		oSeven_rep.innerHTML = html;
		root.renderTemperatureLine(canvas_day, data['forecast_24h'], maxDegreeArr, {
   			attr: 'max_degree',
   			inial_left: 51,
   			text_top: 30,
   			change_top: 35,
   			area: 30,
   			fill_style: 'rgb(255, 183, 77)'
   		});
   		root.renderTemperatureLine(canvas_day, data['forecast_24h'], minDegreeArr, {
   			attr: 'min_degree',
   			inial_left: 51,
   			text_top: 130,
   			change_top: -35,
   			area: 30,
   			fill_style: 'rgb(100, 181, 246)'
   		}, true);
	}
	root.renderWeatherForDay = renderWeatherForDay;
}(window.weather || (window.weather = {})))
