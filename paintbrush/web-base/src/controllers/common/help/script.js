'use strict';

angular.module('ARN')

.controller('Help', ['$scope', function ($scope) {

	var contents = $('.help > .contents'),
		panel = contents.find('> div'),
		handler = function () {

			if (!jQuery.contains(document, contents[0])) {
				$(window).off('scroll', handler);
			}

			if ($(window).scrollTop() > contents.position().top) {
				panel.addClass('fixed');
			}
			else {
				panel.removeClass('fixed');
			}

		};


	$(window).on('scroll', handler);


	$scope.topic = 'faq';//'userguides';

	$scope.enquiryMessage = {
		message: 'If you have any enquiries please contact us at <strong><a href="mailto:hello@artretailnetwork.com">hello@artretailnetwork.com</a></strong> or use our <strong><a href="/enquiry">enquiry form</a></strong>.'
	};


}]);
