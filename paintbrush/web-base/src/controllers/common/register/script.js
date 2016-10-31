(function () {
	'use strict';

	angular
		.module('ARN')
		.controller('Register', ['$scope', '$stateParams', '$http', '$location', 'profileService', function ($scope, $stateParams, $http, $location, profileService) {
	
			// util method to keep registration progress synced in the database
			var syncProgress = function () {
				
				$http.post('/api/register/update-status', {
					UserID: $scope.userID,
					RegistrationID: $scope.registrationID,
					Step: $scope.step,
					Type: $scope.type,
					TotalSteps: $scope.totalSteps,
					CompletedSteps: $scope.completedSteps,
					AffiliateCode: $scope.affiliateCode
				})

			};
		

			$scope.Math = window.Math;


			$scope.userID;
			$scope.setUserID = function (id) {
				$scope.userID = id;
			};

			$scope.registrationID;
			$scope.setRegistrationID = function (id) {
				$scope.registrationID = id;
			};

			$scope.affiliateCodeID;
			$scope.setAffiliateCodeID = function (id) {
				$scope.affiliateCodeID = id;
			};


			$scope.email;
			$scope.setEmail = function (email) {
				$scope.email = email;
				sessionStorage['registrationEmail'] = email;

				if (window.mixpanel) {
					mixpanel.alias(email);
				}
			};

			// completed/total steps for current registration type - used for progress bar only
			$scope.completedSteps = 0;
			$scope.totalSteps = 5;


			// current registration type (e.g. artist|gallery)
			$scope.type;

			
			// sets the type of registration
			$scope.setType = function (type) {
				$scope.type = type;

				if (type === 'artist') {
					$scope.totalSteps = 6;
				}
				else if (type === 'gallery') {
					$scope.totalSteps = $scope.completedSteps;
				}
			};


			// current registration step
			//	0 = email
			//	1 = password
			//	2 = type
			//	3 = terms
			//	4 = profile
			//	5 = artwork
			//	100 = complete
			$scope.step = 0;


			// progresses to the next step for the current registration
			$scope.nextStep = function () {
				if ($scope.type === 'gallery' && $scope.step === 4) {
					$scope.step = 100;
				}
				//else if ($scope.type === 'gallery' && $scope.step === 25) {
				//	$scope.step = 25;	// prevent user from completing profile builder
				//}
				else if ($scope.type === 'artist' && $scope.step === 5) {
					$scope.step = 100;
				}
				else {
					$scope.step += 1;
				}

				// track via Google Analytics
				if (window.ga && $scope.step) {
					window.ga('send', 'pageview', { page: $location.url() + '?s=' + $scope.step });
				}

				// track via MixPanel
				if (window.mixpanel) {
					if ($scope.step === 3) {
						mixpanel.track("Profile Builder", { Type: $scope.type });
					}
					setTimeout(function () {
						mixpanel.track("Profile Builder", { Step: $scope.step });
					}, 50)
				}
				

				$scope.completedSteps += 1;

				syncProgress();

				// check if registration is complete
				if ($scope.step === 100) {
					$scope.complete();
				}
			};

			// finishes registration
			$scope.complete = function () {

				$http.post('/api/register/complete', {
					UserID: $scope.userID,
					RegistrationID: $scope.registrationID
				})
				.success(function () {
					delete sessionStorage['registrationEmail'];
					delete localStorage['registrationEmail'];
					delete localStorage['registrationProfile'];

					// load users profile into root scope
					profileService.get(localStorage['profileID'])
						.then(function (profile) {
							$scope.$root.setUserProfile(profile);
							$scope.$root.authenticated = true;
							//$location.url('/dashboard');
							$location.url('/activcanvas');
						});

					// create a crm contact record for profile
					if (location.port !== '3000' && $scope.email.indexOf('@test') < 0) {
						$http.put('/api/crm/contact/update/' + localStorage['profileID']);
					}
				})

			};


			// check registration status of a specific email address
			$scope.checkStatus = function (email) {
				return $http.post('/api/register/check-status', { Email: email });
			};


			$scope.resume = function (_data) {
				$scope.type = _data.Type;
				$scope.step = _data.Step;
				$scope.completedSteps = _data.CompletedSteps;
				$scope.totalSteps = _data.TotalSteps;
				$scope.userID = _data.UserID;
				$scope.registrationID = _data.RegistrationID;

				if (!localStorage['accessToken']) {
					if ($scope.step) {
						$scope.reAuthenticate = true;
					}
					else if ($scope.email) {
						$scope.step = 1;
					}
				}
				$scope.forceDigest();
			};


			$scope.reset = function () {
				localStorage.clear();
				sessionStorage.clear();
				location.reload();
			};

			var _email = sessionStorage['registrationEmail'];

			// check if user is currently logged in fully - redirect to dashboard
			if (!_email && ($scope.$root.authenticated || (localStorage['accessToken'] && localStorage['profileID'] && localStorage['profileID'] * 1 > 0))) {
				location.href = '/dashboard';
			}
			// resume registration if redirected from login form or user refreshed page
			else if (_email) {
				$scope.setEmail(_email);
				$scope.checkStatus(_email).success(function (resp) {
					if (resp.Exists && !resp.RegistrationID) {
						$location.url('/dashboard');
					}
					else {
						$scope.resume(resp);
					}
				});
			}



			// check if any profile data from FB/Google is in localStorage
			$scope.registrationProfile = JSON.parse(localStorage.registrationProfile || '{}');



		}]);

})();
