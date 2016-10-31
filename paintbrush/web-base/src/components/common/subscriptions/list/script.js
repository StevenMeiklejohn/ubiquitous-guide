

angular.module('ARN')

.directive('subscriptionList', [function () {
	return {
		templateUrl: 'components/common/subscriptions/list/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$http', '$element', '$compile', function ($scope, $http, $element, $compile) {

			$http.get('/api/subscriptions/statuses')
				.success(function (statuses) {
					$scope.statuses = statuses;
				})


			var filters = {};

			$scope.setFilter = function (type, value, label, $event) {

				var el = $element.find('[data-filter=' + type + ']'),
					lastValue = filters[type],
					changed = lastValue !== value;

				if (typeof lastValue === 'object') {
					changed = JSON.stringify(lastValue) !== JSON.stringify(value);
				}

				if (value === undefined) {
					delete filters[type];
					el.find('.label .text').html(type);
				}
				else {
					filters[type] = value;

					if (label) {
						el.find('.label .text').html(type + ': <strong>' + label + '</strong>');
					}
					else if ($event) {
						el.find('.label .text').html(type + ': <strong>' + $($event.currentTarget).text() + '</strong>');
					}
				}

				if (changed) {

					$scope.focusFilters();
					$scope.applyFilters();

				}
			};


			$scope.applyFilters = function () {

				var subs = [],
					props = Object.keys(filters);

				if (!props.length) {
					subs = $scope.subscriptionsBase.slice(0);
				}
				else {
					$scope.subscriptionsBase.forEach(function (s) {
						var match = true;
						props.forEach(function (p) {
							if (filters[p] != s[p]) {
								match = false;
							}
						});
						match && subs.push(s);
					})
				}
				
				$scope.subscriptions = subs;
			}

			$scope.focusFilters = function () {
				var page = $(browser.name.toLowerCase() === 'chrome' ? ' body' : 'html, body'),
					top = $element.find('.filters').offset().top - 10,
					dist = page.scrollTop() - top;

				if (dist > 0) {
					page.scrollTop(top);
				}
			}

			$scope.cancel = function (subscriptionID) {
				
				//var subscription;
				//$scope.subscriptions.forEach(function (s) {
				//	if (s.ID === subscriptionID) {
				//		subscription = s;
				//		return false;
				//	}
				//});

				new Dialog({
					title: '<h2>Cancel Subscription</h2>',
					html: '<div class="message orange">Are you sure?</div>',
					buttons: [{
						text: 'Yes',
						'class': 'blue',
						onclick: function () {

							$http.put('/api/subscriptions/' + subscriptionID + '/cancel')
								.success(function () {
									$scope.refreshSubscriptionList();
								})
								.error(function (err) {
									new Dialog.Info({
										title: 'Error',
										html:  '<p>' + err.Message + '</p>'
									})
								});

						}
					}]
				})
			}


			$scope.viewDetails = function (subscription, e) {

				$element.find('.drawer.open').removeClass('open').addClass('closed');
				$element.find('.row').removeClass('highlight');

				var target = $(e.currentTarget),
					next = target.next();

				if (next.hasClass('drawer')) {
					next.addClass('open').removeClass('closed');
				}
				else {
					//Math.ceil((config.package.Price - (config.package.Price*(affiliateCode.Discount/100))) * 100)/100}}

					var _price = subscription.Price;
					if (subscription.Discount) {
						var startDate = new Date(subscription.StartDate),
							cutoffDate = new Date(startDate.setMonth(startDate.getMonth() + subscription.DiscountDuration))

						if (!subscription.DiscountDuration || cutoffDate > new Date()) {
							_price = Math.ceil((_price - (_price * (subscription.Discount / 100))) * 100) / 100;
						}
					}

					target.after('<tr class="drawer"><td colspan="' + target.find('td').size() + '"></td></tr>');
					var temp = $compile(
						'<div class="content">' +
							'<table>' +
							'<tr><td class="label">Price:</td><td>&pound;' + _price + ' / month</td><td class="label">Payment Method:</td><td>Credit/Debit Card</td></tr>' +

							(subscription.Discount || subscription.TrialPeriod ? '<tr><td class="label">Discount:</td><td>' + subscription.Discount + '% OFF' + (subscription.DiscountDuration ? ' (first ' + subscription.DiscountDuration + ' months)' : subscription.Discount && !subscription.DiscountDuration ? ' (forever)' : '') + '</td><td class="label">Free Trial Period:</td><td>' + subscription.TrialPeriod + ' months</td></tr>' : '') +
							(subscription.Last4 ? '<tr><td class="label">Card Type:</td><td>' + subscription.Brand + '</td><td class="label">Number:</td><td>xxxx xxxx xxxx ' + subscription.Last4 + '</td></tr>' : '') +

							//'<tr><td class="label">Card:</td><td>xxxx xxxx xxxx 4242</td><td class="label">Next Payment:</td><td>01 Nov</td></tr>' +
							'<tr><td class="label">Activated Artworks Limit:</td><td>Unlimited</td><td class="label">Activated Videos Limit:</td><td>Unlimited</td></tr>' +
							'</table>' +
							//(subscription.StatusID === 2 ? '<div class="controls right"><i ng-click="cancel(' + subscription.ID + ')" title="Cancel this subscription" class="fa fa-lg fa-times"></i></div>' : '') +
						'</div>'
					)($scope);
					target.next().find('td').append(temp);

					setTimeout(function () {
						next = target.next();
						next.addClass('open');

						setTimeout(function () {
							next.find('.content').css('max-height', next.find('.content').height() + 'px');
						}, 600);
					}, 1)
				}

				target.addClass('highlight');


			}

		}]
	}
}]);

