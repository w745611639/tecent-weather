function getStyle(obj, pseudo) {
 		return obj.currentStyle || getComputedStyle(obj, pseudo);
}

function whichTransitionEvent() {   // 返回支持的过渡事件
 	var t,
		div = document.createElement('div');
		transtions = {
			'transition': 'transitionend',
          	'OTransition': 'oTransitionEnd',
          	'MozTransition': 'transitionend',
          	'WebkitTransition': 'webkitTransitionEnd'
		};
	for(t in transtions) {
		if(div.style[t] !== undefined) {
			return transtions[t];
		}
	}
 }
 function bindTransitionEvent(transitionEvent, obj, callback) {
	obj.addEventListener(transitionEvent, function () {
		callback();
		this.removeEventListener(transitionEvent, arguments.callee, false);
	})
}