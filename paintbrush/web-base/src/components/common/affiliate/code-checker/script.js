(function(){

angular.module('ARN')


.directive('affiliateCodeChecker', ['$q', '$http', function ($q, $http) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'components/common/affiliate/code-checker/tpl.htm',
		link: function ($scope, $element, $attrs) {

			var checkAffiliateTimer,
				checkAffiliateRequest;

			var checkAffiliateCode = function (e) {
				var el = $(this), val = $(this).val().toUpperCase();

				if (!e.keyCode || e.keyCode === 8 || e.keyCode == 46 || (e.keyCode > 47 && e.keyCode < 58) || (e.keyCode > 64 && e.keyCode < 91)) {
					
					clearTimeout(checkAffiliateTimer);

					if (checkAffiliateRequest) {
						checkAffiliateRequest.resolve();
					}

					el.val(val); // enforce uppercase input

					if (!val) {
						$scope.codeStatus = 0;
						$scope.$root.forceDigest();
						el[0].setCustomValidity('');
					}
					else {
						el[0].setCustomValidity('Please wait while code is checked');
						$element.find('[name=AffiliateCodeID]').val('');

						checkAffiliateTimer = setTimeout(function () {
							$scope.codeStatus = 1;

							checkAffiliateRequest = $q.defer();
							$http.get('/api/affiliate/check/' + val, { timeout: checkAffiliateRequest.promise })
								.success(function (code) {
									$scope.affiliateCode = (code || $scope.affiliateCode);

									if (!code.ID) {
										el[0].setCustomValidity('This code was not found');
										$scope.codeStatus = 2;
									}
									else if (code.ExpiryDate && new Date(code.ExpiryDate) < new Date()) {
										el[0].setCustomValidity('This code is no longer valid (Expired ' + DateUtils.format.short(code.ExpiryDate) + ')');
										$scope.codeStatus = 3;
									}
									else if (code.UsesRemaining === 0) {
										el[0].setCustomValidity('This code is no longer valid');
										$scope.codeStatus = 3;
									}
									else {
										$scope.codeStatus = 4;
										$element.find('[name=AffiliateCodeID]').val(code.ID);
										el[0].setCustomValidity('');
									}
								})
								.error(function (message, status) {
									if (status) {	// exclude aborted requests
										el[0].setCustomValidity('This code was not found');
										$scope.codeStatus = 2;
									}
								})
								.finally(function () {
									//form.clearMessage(null, el);
								})
						}, 500);
					}

				}
				else if (e.keyCode === 32) {
					el.val(val.replace(/ /g, ''));
				}

			};


			setTimeout(function () {
				$element.find('[name=AffiliateCode]').keyup(checkAffiliateCode).keyup();
			}, 1)

			
		}
	}
}])



})();
