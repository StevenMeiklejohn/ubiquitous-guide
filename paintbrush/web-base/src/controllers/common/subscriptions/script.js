'use strict';
angular.module('ARN').controller('Subscriptions', ['$scope', '$location', '$sce', '$http', 'profileService', 'cacheProvider', function ($scope, $location, $sce, $http, profileService, cacheProvider) {

	$scope.refreshSubscriptionList = function (complete) {
		
		$http.get('/api/subscriptions/list')
			.success(function (subscriptions) {
				subscriptions.forEach(function (s) {
					s._StartDate = DateUtils.format.friendly(s.StartDate);
					s._StartDateFull = DateUtils.format.full(s.StartDate);
					s._EndDate = DateUtils.format.friendly(s.EndDate);
					s._EndDateFull = DateUtils.format.full(s.EndDate);
				});

				$scope.subscriptions = subscriptions;
				$scope.subscriptionsBase = subscriptions.slice(0);
			})
			.finally(complete);

	};

	$scope.refreshSubscriptionList(function () {
		$scope.view = $location.$$search.v || ($scope.subscriptions.length ? 'subscription-list': 'activcanvas-packages');
	});


	$scope.setPackage = function (p) {
		$scope.package = p;

		$scope.paymentDetailsConfig.package = p;

		//$scope.paymentDetailsConfig.message = $sce.trustAsHtml(
		//	'<h4>Package: ' + p.Name + '</h4>' +
		//	'<table>' +
		//	'<tr><td>Cost:</td><td>&pound;' + p.Price + '/month</td></tr>' +
		//	'<tr><td>Activated Artworks:</td><td>Unlimited</td></tr>' +
		//	'<tr><td>Activated Videos:</td><td>Unlimited</td></tr>' +
		//	'</table>'
		//);
	};


	$scope.back = function () {
		
		switch ($scope.view) {
			case 'payment-details': $scope.view = 'activcanvas-packages'; break;
			case 'processing-payment': $scope.view = 'payment-details'; break;
		}

	};

	$scope.next = function () {

		switch ($scope.view) {
			case 'activcanvas-packages': $scope.view = 'payment-details'; break;
			case 'payment-details': $scope.view = 'processing-payment'; break;
		}

	};

	$scope.paymentDetailsConfig = {
		message: $sce.trustAsHtml(''),
		back: $scope.back,
		submit: function (data) {

			$scope.pendingRequest = true;

			$http.post('/api/subscriptions/create', $.extend(data, {
				PackageID: $scope.package.ID
			}))
			.success(function () {
				cacheProvider('').clear();

				$scope.successMessage = $sce.trustAsHtml(
					'Congratulations, payment for \'<strong>' + $scope.package.Name + '</strong>\' was successful  <i class="fa fa-check"></i>'
				);
				
				$scope.refreshSubscriptionList(function () {
					$scope.view = 'subscription-list';

					// refresh profile
					$scope.$root.setActiveProfileByID($scope.$root.activeProfile.ID);

					// update crm record
					if (location.port !== '3000') {
						$http.put('/api/crm/contact/update/' + _profileID);
					}
				});

			})
			.error(function (err) {
				$scope.successMessage = '';
				$scope.errorMessage = err.Message;
				
				//$scope.back();
			})
			.finally(function () {
				$scope.pendingRequest = false;
			});

			//$scope.next();
		}
	};

	//$scope.view = 'payment-details';


	

}]);
