(function($) {

	$('body').append(
			'<div id="arn-overlay" style="position:fixed;left:0;right:0;top:0;bottom:0;background:rgba(0,0,0,0.4);padding:80px 10px 10px;width:100vw;height:100vh;z-index:2147483647;">' +
			'<div style="color:#fff">' +
				'<div><strong>Pages Scanned: </strong><span class="page-pr">0</span></div>' +
				'<div><strong>Connection Requests Sent: </strong><span class="total-r">0</span></div>' +
				'<div><strong>Successful Requests: </strong><span class="succ-r">0</span></div>' +
				'<div><strong>Failed Requests: </strong><span class="fail-r">0</span></div>' +
			'</div>' +
			'</div><style>#arn-overlay iframe {width: 1000px;height:800px; margin-top: 20px;}</style>'
	);

	var container = $('#arn-overlay');

	var pagesProcessed = 0, totalRequests = 0, successfulRequests = 0, failedReqests = 0;

	var updateStats = function () {
		container.find('.page-pr').text(pagesProcessed);
		container.find('.total-r').text(totalRequests);
		container.find('.succ-r').text(successfulRequests);
		container.find('.fail-r').text(failedReqests);
	};

	var addFrame = function (url) {
		container.find('iframe').remove();

		var frame = document.createElement('iframe');
		frame.onload = function() {
			pagesProcessed += 1;
			updateStats();

			setTimeout(function() {

				// press connect buttons
				container.find('iframe').contents().find('.srp-actions a.primary-action-button').each(function() {
					if($(this).text() === 'Connect') {
						totalRequests += 1;
						updateStats();

						$.ajax({
							url: $(this).data('li-connect-href'),
							type: "GET",
							beforeSend: function(xhr){xhr.setRequestHeader('X-IsAJAXForm', '1');},
							success: function() {
								successfulRequests += 1;
								updateStats();
							},
							error: function () {
								failedReqests += 1;
								updateStats();
							}
						});

					}
				});

				setTimeout(function() {

					// look for next page button - grab url
					var nextURL = container.find('iframe').contents().find('.page-link[rel=next]').attr('href');

					if (nextURL) {
						addFrame(nextURL);
					}
					else {
						alert(
							'End of results\n\n' +
							'Pages Scanned: ' + pagesProcessed + '\n' +
							'Requests Sent: ' + totalRequests + '\n' +
							'Successful: ' + successfulRequests + '\n' +
							'Failed: ' + failedReqests
						);
						container.remove();
					}

				}, 7000);

			}, 2000);

		};
		frame.src = 'https://www.linkedin.com' + url;
		container.append(frame);

	};

	var _url = $('.page-link[rel=next]').attr('href');
	addFrame(_url.replace('&page_num=2', '&page_num=1'));

})(jQuery);