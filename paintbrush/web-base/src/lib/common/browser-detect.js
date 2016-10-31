(function () {
	var ua = navigator.userAgent, tem,
    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
		M[0] = 'IE'
		M[1] = (tem[1] || '');
	}
	else {
		//if (M[1] === 'Chrome') {
		//	tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
		//	if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
		//}
		M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
		if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
	}

	window.browser = {
		name: M[0],
		version: M[1]
	}

	browser[M[0].toLowerCase()] = true;
	
	$(document).ready(function() { $('body').addClass((M[0] + ' ' + M[0] + '-' + M[1]).toLowerCase()) });
})();