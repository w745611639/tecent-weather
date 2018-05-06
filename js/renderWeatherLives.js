(function (root) {
	function renderWeatherLives (data) {   			// ---> 生活相关的数据
		var liv_ul = document.querySelector('.live-show ul'),
			arr =  ['umbrella', 'clothes', 'sunscreen', 'cold', 'sports',
					'carwash', 'fish', 'traffic', 'diffusion', 'makeup',
					'heatstroke', 'comfort', 'mood', 'tourism', 'ultraviolet',
					'allergy'
					],    // 与返回的数据进行匹配
			index = data.index,
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

	root.renderWeatherLives = renderWeatherLives;
}(window.weather || (window.weather = {})))
