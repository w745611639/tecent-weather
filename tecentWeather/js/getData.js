(function (root) {
	// 获取城市天气
	function getData (province, city, country) {
		province = province || '湖南';
		city = city || '衡阳市';
		country = country || '';
		var oScript = document.createElement('script');
		oScript.src = `https://wis.qq.com/weather/common?source=pc&weather_type=observe%7Cforecast_1h%7Cforecast_24h%7Cair%7Cindex&province=${province}&city=${city}&country=${country}&callback=weather.renderWeatherData`;
		
		document.body.appendChild(oScript);
		oScript.remove();
	}
	root.getData = getData;
}(window.weather || (window.weather = {})))
