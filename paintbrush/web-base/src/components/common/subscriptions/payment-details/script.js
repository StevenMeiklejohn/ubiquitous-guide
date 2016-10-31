

angular.module('ARN')

.directive('paymentDetails', [function () {
	return {
		templateUrl: 'components/common/subscriptions/payment-details/tpl.htm',
		controllerAs: 'ctrl',
		//bindToController: true,
		scope: { config: '=' },
		//link: function() {},
		controller: ['$scope', '$http', '$element', '$sce', function ($scope, $http, $element, $sce) {

			var config = $scope.config, form, tabs;

			if (config.back) {
				$scope.back = config.back;
			}
			if (config.submit) {
				$scope.submit = function() {
					if (!form.isValid()) {
						form.displayValidationErrors();
					}
					else {
						form.clearMessage('inline');
						var _data = form.getData();
						_data.Number = _data['Number-0'] + _data['Number-1'] + _data['Number-2'] + _data['Number-3'];
						delete _data['Number-0'];
						delete _data['Number-1'];
						delete _data['Number-2'];
						delete _data['Number-3'];
						_data.PaymentProviderID = tabs.activeTab.data('providerid') * 1;
						config.submit(_data);
					}
				};
			}

			$scope.Math = Math;

			$scope.expYears = [];
			var currentYear = new Date().getFullYear();
			for (var i = 0; i < 11; i++) {
				$scope.expYears.push(currentYear + i);
			}


			
			tabs = new Tabs($element.find('.tabs'));

			setTimeout(function () {

				
				form = new Form($element.find('form'), {
					autoScroll: true,
					errors: { inline: true }
				});


				var cardInputs = form.root.find('.card-number > input');
				//cardInputs.focus(function () {
				//	var el = $(this);
				//
				//	if (!el.data('t')) {
				//		cardInputs.each(function () {
				//			if ($(this).val().length < 4) {
				//				$(this).data('t', 1).focus();
				//				return false;
				//			}
				//		});
				//	}
				//	else {
				//		el.data('t', 0);
				//	}
				//});
				cardInputs.keyup(function (e) {
					var el = $(this);

					var error = '', part = $(this).data('cardpart') * 1;
					if (isNaN(el.val().replace(/e/gi, 'a') * 1)) {
						error = 'Value must be numeric';
					}
					else if (el.val().length < 4) {
						error = 'Value must be 4 numbers long';
					}
					el[0].setCustomValidity(error);

					if (e.keyCode === 8 && !el.val()) {
						var prev = cardInputs.filter('[data-cardpart=' + (part - 1) + ']');
						if (prev.attr('name')) {
							prev.data('t', 1).focus();
						}
					}
					else if (el.val().length > 3) {
						var next = cardInputs.filter('[data-cardpart=' + (part + 1) + ']');
						if (next.attr('name')) {
							next.data('t', 0).focus();
						}
					}
				});

			}, 250)


			$http.get('/api/affiliate/registration-code')
			 .success(function (code) {
			 	$scope.affiliateCode = code;

			 	setTimeout(function () { $element.find('[name=AffiliateCode]').keyup(); }, 10)
			 })


			 console.log($scope)

		}]
	}
}]);

