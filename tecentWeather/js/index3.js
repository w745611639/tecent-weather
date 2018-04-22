//1.初始化函数，渲染定位城市天气数据;(jsonp)
//2,城市搜索框联想搜索城市。并下拉展示(jsonp)
//3.点击具体城市，渲染该城市的天气数据(jsonp)
var portObj = {};
(function (global, part) {
	var oSearch = document.querySelector('.search');
	var oInp = oSearch.querySelector('.search-bar input');


	// 点击搜索框区域，显示城市列表;
	oSearch.addEventListener('click', function (e) {
		var oHidden = this.querySelector('.hidden');
		e.stopPropagation();
		oHidden.style.display = 'block';
		// 点击其他区域，隐藏城市列表
		document.addEventListener('click', function () {
			oHidden.style.display = 'none';
		}, false);

	}, false);

	//  搜索框 input 元素添加input事件;联想搜索城市(节流)
	oInp.addEventListener('input', (function (handle, waitTime) {
		var timer = null;  // 私有化属性
		return function () {
			var _this = this;
			clearTimeout(timer);
			timer = setTimeout(function () {
				handle.call(_this);
			}, waitTime);
		}
	}(function () { 
		var oScript = document.createElement('script');
		oScript.src = 'https://wis.qq.com/city/like?source=pc&city=' + this.value + '&callback=portObj.searchCity';
		document.body.appendChild(oScript);
		oScript.remove();
	}, 1000)), false);


	// 返回一个对象接口，用于生成的js执行对象接口中的方法;
	part.searchCity = function (json) {
		var oMcity = oSearch.querySelector('.l-m-city'),
			oMatch = oSearch.querySelector('.c-match'),
			value = oInp.value,
			temp,
			str = '',
			replaceValue = '<span>' + value + '</span>',
			reg = new RegExp('(' + value + ')', 'g'),
			data = json.data;
		for(var prop in data) {
			temp = data[prop];
			str += '<li>' + temp + '</li>';
		}
		str = str.replace(reg, replaceValue);   // 与input.value匹配的内容添加span标签
		oMatch.innerHTML = str;
		oMcity.style.display = 'none';
		oMatch.style.display= 'block';
		console.log(json);
	};
}(window, portObj));
