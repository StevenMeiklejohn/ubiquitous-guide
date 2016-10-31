;(function () {
	'use strict';


	function ProfilePublicViewController($scope, $stateParams, $http, $location, $compile, profileService, socialMediaService) {

		var id,
			currentDirective;	// currently loaded directive


		$scope.profile = null;
		//$scope.featured = [];
		//$scope.loadDirective = function (directive) {
		//
		//	switch (directive.toLowerCase()) {
		//		case 'artwork-edit':
		//			delete $scope.artworkID;
		//			if (arguments[1]) {
		//				$scope.artworkID = arguments[1];
		//			}
		//			break;
		//		case 'profile-video-edit':
		//			delete $scope.videoID;
		//			if (arguments[1]) {
		//				$scope.videoID = arguments[1];
		//			}
		//			break;
		//	}
		//
		//	if (directive !== currentDirective) {
		//		currentDirective = directive;
		//		//var el = angular.element('<div ' + directive + '></div>');
		//		var el = angular.element('<' + directive + '><' + directive + '/>');
		//		$('.directives').html('').append(el);
		//		$compile(el)($scope);
		//	}
		//};
		$scope.follow = function() {
			$http.get('/api/profile/' + $scope.profile.ID + '/action/follow')
				.success(function () {
					new Dialog.Info({
						title: '<h4>Success</h4>',
						html: 'You are now following ' + $scope.profile.Name
					});
					$scope.profile.Following = true;
				})
				.catch(function () {

				});
		};
		$scope.unfollow = function () {
			$http.get('/api/profile/' + $scope.profile.ID + '/action/unfollow')
				.success(function () {
					new Dialog.Info({
						title: '<h4>Success</h4>',
						html: 'You are no longer following ' + $scope.profile.Name
					});
					$scope.profile.Following = false;
				})
				.catch(function () {

				});
		};
		//$scope.connect = function () {
		//
		//
		//	var busy = new Dialog({ 'class': 'busy', html: '<div class="ajax-loader"></div><strong>Checking connection status...</strong>' });
		//
		//	$http.get('/api/connections/' + $scope.profile.ID + '/status')
		//		.success(function (status) {
		//
		//			if (status.Connected) {
		//				new Dialog.Info({ title: '<h4>Request Connection</h4>', width: 400, html: '<div class="message">' + status.Message + '</div>' });
		//			}
		//			else {
		//
		//				var d = new Dialog({
		//					title: '<h4>Request Connection</h4>',
		//					width: 400,
		//					autoClose: false,
		//					html:
		//						'<div class="message" style="margin: 10px 0;">You can attach a short message to ' + $scope.profile.Name + ' with this request.</div>' +
		//						'<form id="frm-crq"><textarea  style="min-width: 358px;max-width: 358px;" maxlength="512"></textarea></form>' +
		//						'<div class="message error">NOTE: Connection requests are limited. If this request is not accepted you will have to wait a small period of time before making a new request to them.</div>',
		//					buttons: [{
		//						text: 'Cancel',
		//						icon: { left: 'fa fa-reply' },
		//						onclick: function () {
		//							d.tidy();
		//						}
		//					}, {
		//						text: 'Send',
		//						icon: { left: 'fa fa-send' },
		//						class: 'sky-blue',
		//						onclick: function () {
		//
		//							d.hide();
		//							busy = new Dialog({ html: '<div class="ajax-loader"></div><strong>Sending connection request...</strong>' })
		//
		//							$http.post('/api/connections/connect/', { ProfileID: $scope.profile.ID, Message: d.root.find('textarea').val() })
		//								.success(function () {
		//									d.tidy();
		//									new Dialog.Info({ title: 'Request Connection', html: '<div class="message">Connection request successfully sent.</div>' });
		//								})
		//								.catch(function (err) {
		//									d.root.find('.message.error').html(err.data.Message);
		//									d.show();
		//								})
		//								.finally(busy.tidy);
		//
		//						}
		//					}]
		//				})
		//
		//			}
		//
		//		})
		//		.error(function (status) {
		//
		//			if (status.Pending) {
		//				new Dialog({
		//					title: '<h4>Request Connection</h4>',
		//					width: 400,
		//					html: '<div class="message">' + status.Message + '</div>',
		//					buttons: [{
		//						text: 'OK',
		//						icon: { left: 'fa fa-thumbs-o-up' }
		//					}, {
		//						text: 'Pending Requests',
		//						icon: { left: 'fa fa-link fa-flip-horizontal' },
		//						'class': 'sky-blue',
		//						onclick: function () {
		//							$location.url('/connections?pending=1');
		//						}
		//					}]
		//				})
		//			}
		//			else {
		//				new Dialog.Info({ title: '<h4>Request Connection</h4>', width: 400, html: '<div class="message error">' + status.Message + '</div>' });
		//			}
		//
		//		})
		//		.finally(busy.tidy)
		//
		//
		//};
		$scope.sendMessage = function () {
			$location.url('/inbox/compose/' + $scope.profile.ID);
		};


		// hide view body until profile has been loaded
		$('.view-body').hide();


		var loadProfile = function() {
			id = ($stateParams.id || $scope.$root.activeProfile.ID || localStorage.profileID || 0) * 1;

			profileService.get(id)
				.then(function(data) {

					$scope.docTitle(data.Name + ' | Artist Search');

					// if the current user has updated thier profile ensure changes are reflected throughout entire app
					if (data.ID === $scope.userProfile.ID) {
						$scope.$root.setUserProfile(data);
					}

					if (data.Contact && data.Contact.Website) {
						data.Contact.WebsiteURI = data.Contact.Website + '';
						data.Contact.Website = data.Contact.Website.split('://')[1];
					}

					data.ImageURI_280 = '/api/proxy/image/' + encodeURIComponent(data.ImageURI) + '/280';
					$scope.profileImageStyle = { backgroundImage: 'url(' + data.ImageURI_280 + ')' };

					$scope.profile = data;
					$scope.profile.IsOwn = (localStorage.profileID * 1) === $scope.profile.ID;

				})
				.catch(function (e) {
					$scope.error = { type: 'error', message: e.data ? e.data.Message : 'Unknown error' };
				})
				.finally(function () {
					$('.view-loading').hide();
					$('.view-body').show();
					if ($scope.profile) {
						//$('.view-body').show();

						$scope.$root.forceDigest(function () {
							$scope.tabs = new Tabs($('.tabs'));
						})
					}
				});
		};

		if ($scope.$root.activeProfile && $scope.$root.activeProfile.ID > 0) {
			loadProfile();
		}
		else {
			var profileWatcher = $scope.$watch('$root.activeProfile', function(val) {
				if (val && val.ID > 0) {
					loadProfile();
					profileWatcher();
				}
			});
		}

	};


	angular
		.module('ARN')
		.controller('ProfilePublicView', [ '$scope', '$stateParams', '$http', '$location', '$compile', 'profileService', 'socialMediaService', ProfilePublicViewController ]);

})();
