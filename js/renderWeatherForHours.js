(function (root) {
	function renderWeatherForHours (data) {
		var oForcast_1h = document.querySelector('.wrap-forecast-1h .forecasts'),
			canvas_1h = document.querySelector('.wrap-forecast-1h canvas'),
			html = '',
			degreeArr = [],
			prop,
			temp;
		for(prop in data['forecast_1h']) {
				temp = data['forecast_1h'][prop];
			degreeArr[prop] = +temp.degree;
			html += `
				<li class='item'>
					<p>${root.pickTime(temp.update_time, -6, 4)}</p>
					<img src="./images/00.png" alt="" />
				</li>
			`
		}
		oForcast_1h.innerHTML = html;
		root.renderTemperatureLine(canvas_1h, data['forecast_1h'], degreeArr, {
   			attr: 'degree',
   			inial_left: 51,
   			text_top: 25,
   			change_top: 30,
   			area: 10,
   			fill_style: 'rgb(255, 183, 77)'
   		}); 		
	}
	root.renderWeatherForHours = renderWeatherForHours;
}(window.weather || (window.weather = {})))
