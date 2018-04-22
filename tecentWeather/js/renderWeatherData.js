(function (root) {
	// 渲染入口
	function renderWeatherData (json) {
		var data = json.data;
		console.log(data);
		root.renderWeatherIntro(data);
		root.renderWeatherForHours(data);
		root.renderWeatherForDay(data);
		root.renderWeatherLives(data);
	}
	root.renderWeatherData = renderWeatherData;
}(window.weather || (window.weather = {})))

