'use strict';

angular.module('ARN').controller('InboxView', ['$scope', '$stateParams', '$sce', '$location', '$compile', 'notification', 'messageService', 'proxyService',
	function ($scope, $stateParams, $sce, $location, $compile, notification, messageService, proxy) {

		$scope.deleteNotification = function (n) {
			var scope = $scope.$new(true);
			scope.message = { type: 'question', message: 'Are you sure you would like to delete this message?' };

			new Dialog({
				title: ' ',
				html: $compile('<ui-message class="static" config="message"/>')(scope),
				buttons: [{
					text: 'No',
					icon: { left: 'fa fa-reply' }
				}, {
					text: 'Yes',
					icon: { left: 'fa fa-trash' },
					'class': 'orange',
					onclick: function () {
						notification.remove(n.ID).then(function () {
							$location.url('/inbox');
						});
					}
				}]
			})
		};

		$scope.toggleCollapse = function(e) {
			$(e.currentTarget).parent().toggleClass('collapsed')
		};

		$scope.showCompose = false;
		$scope.toggleCompose = function() {
			$scope.showCompose = !$scope.showCompose;
		};

		$scope.sendMessage = function() {
			if (!$scope.message || !$scope.message.body) {
				$scope.errorCompose = { type: 'error', message: 'Please enter a message body' };
			}
			else {
				$scope.message.sending = true;

				var subject = $scope.notification.Subject;
				if (subject.indexOf('RE: ') !== 0) {
					subject = 'RE: ' + subject;
				}

				var _m = $scope.notification.Messages[0],
					_message = {
						Subject: subject,
						Body: $scope.message.body.replace(/\r|\n/g, '<br/>'),
						PreviousMessageID: _m.ID,
						RecipientProfileID: _m.SenderProfileID
					};

				messageService.send(_message)
					.then(function() {
						$scope.message.sent = true;
						$scope.messageSent = { type: 'success', message: 'Message successfully sent.' };
						_message.SenderProfileID = $scope.userProfile.ID;
						_message.SenderProfileName = $scope.userProfile.Name;
						_message._SenderProfileImageURI = $scope.userProfile.ImageURI_90;
						_message._Body = $sce.trustAsHtml(_message.Body);
						_message.DateFriendly = DateUtils.format.friendly(new Date());
						_message.DateFull = DateUtils.format.full(new Date());
						$scope.notification.Messages.splice(0, 0, _message)
					})
					.catch(function(err) {
						$scope.errorCompose = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
						$scope.message.sending = false;
					});
			}

		};


		var loadNotification = function () {

			notification.get($stateParams.id)
				.then(function(data) {
					data._Body = $sce.trustAsHtml(data.Body);
					data.Date = DateUtils.format.friendly(new Date(data.SentDate));

					if (data.Messages) {
						data.Messages.forEach(function(m) {
							m._Body = $sce.trustAsHtml(m.Body);
							m._SenderProfileImageURI = proxy.image(m.SenderProfileImageURI, 90);
							m.DateFriendly = DateUtils.format.friendly(new Date(m.SentDate));
							m.DateFull = DateUtils.format.full(new Date(m.SentDate));
							m.Collapsed = true;
						});
						data.Messages[0].Collapsed = false;
					}

					$scope.notification = data;
					$scope.ready = true;

					if (!data.ReadDate) {
						notification.markAsRead(data.ID);
					}

					$scope.$root.docTitle(data.Subject + ' | Notifications | ' + $scope.$root.activeProfile.Name, 10);
				})
				.catch(function(err) {
					$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
					$scope.notification = { Subject: 'View Message' }
				});
		};

		loadNotification();

	}]);
