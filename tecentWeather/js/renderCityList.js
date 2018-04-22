(function (root) {
	var oSearch_input = document.querySelector('.search-bar input'),
		oMatch = document.querySelector('.c-match'),
		Ocity = document.querySelector('.l-m-city');
	function renderCityList (json)  {   // --> 搜索城市，根据input.value 值来筛选目标城市		 
		var str = '',
			data = json.data,
			value = oSearch_input.value,
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
	}
	root.renderCityList = renderCityList;
}(window.weather || (window.weather = {})))
