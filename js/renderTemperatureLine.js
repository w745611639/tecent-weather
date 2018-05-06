(function (root) {
	function renderTemperatureLine (canvasObj, dataObj, attrArr, dataJson, bool) {
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
	root.renderTemperatureLine = renderTemperatureLine;
}(window.weather || (window.weather = {})))
