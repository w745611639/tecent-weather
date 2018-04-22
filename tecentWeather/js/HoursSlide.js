(function (root) {
	var flag = true,	
		oWea_for_1h = document.querySelector('.wea-show .wrap-forecast-1h'),
		Left = parseFloat(getStyle(oWea_for_1h, null).left),
		maxLeft = oWea_for_1h.offsetWidth - 1250;
	// 小时天气预报滑动
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
			bindTransitionEvent(root.transitionEvent, oWea_for_1h, function () {
				flag = true;
			});
		}
	}
	root.forecastHoursSlide = forecastHoursSlide;
}(window.weather || (window.weather = {})))
