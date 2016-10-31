'use strict';

angular.module('ARN')

.controller('ActivCanvasLanding', ['$scope', function ($scope) {

	setTimeout(function () {

		var videos = $('video');
		videos.on('play', function () {
			videos.not(this).each(function () {
				this.pause();
			});
		});

	}, 250)


	$('html, body').scrollTop($('header.page').outerHeight());

}]);
