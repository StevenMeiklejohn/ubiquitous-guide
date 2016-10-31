'use strict';

angular.module('ARN').controller('MessagesCompose', ['$scope', '$stateParams', '$location', 'profileService', 'messageService', 'proxyService',
	function ($scope, $stateParams, $location, profileService, messageService, proxy) {

		var recipientProfileID = $stateParams.recipientID;

		$scope.showCompose = true;
		//$scope.toggleCompose = function() {
		//	$scope.showCompose = !$scope.showCompose;
		//};

		$scope.sendMessage = function() {
			if (!$scope.message.body) {
				$scope.errorCompose = { type: 'error', message: 'Please enter a message body' };
			}
			else if (!$scope.message.subject) {
				$scope.errorCompose = { type: 'error', message: 'Please enter a subject' };
			}
			else {
				$scope.message.sending = true;

				var _message = {
						Subject: $scope.message.subject,
						Body: $scope.message.body.replace(/\r|\n/g, '<br/>'),
						RecipientProfileID: $scope.recipient.ID
					};

				messageService.send(_message)
					.then(function() {
						//$scope.message.sent = true;
						$scope.error = { type: 'success', message: 'Your message has been sent to ' + $scope.recipient.Name };
						//$location.url('')

					})
					.catch(function(err) {
						$scope.errorCompose = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
						$scope.message.sending = false;
					});
			}

		};


		if (recipientProfileID) {
			profileService.get(recipientProfileID).then(function(profile) {
				$scope.profileImageStyle = { backgroundImage: 'url(' + proxy.image(profile.ImageURI, 180) + ')' };
				$scope.recipient = profile;
				$scope.ready = true;
				$scope.message = {};

				$scope.contactMethods = [{
					Name: 'Website',
					Enabled: true
				},{
					Name: 'Desktop Notification',
					Enabled: true
				},
				//	{
				//	Name: 'Push Notification',
				//	Enabled: true
				//},
					{
					Name: 'Email',
					Enabled: true
				}];
			})
			.catch(function (err) {
				$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
			});
		}
		else {
			$scope.error = { type: 'error', message: 'Recipient profile not found' };
		}




	}]);
