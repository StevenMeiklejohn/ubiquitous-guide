(function () {

	//var added = {}, pending = {};

	var addScript = function (src, onload) {
		var script = document.createElement('script');
		script.onload = onload;
		script.onerror = function () {
			onload.call(this);
		};
		//script.async = false;
		script.src = src;
		script['data-uri'] = src;
		document.head.appendChild(script);
	};



	window.require = function (source, complete) {

		if (source instanceof Array) {
			// todo
		}
		else {
			addScript(source, complete);
		}


	}

})();

