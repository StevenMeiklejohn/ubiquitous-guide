

angular.module('ARN')

.directive('artworkManageViewProduct', ['$location', 'watchService', 'productService', function ($location, watchService, productService) {
	var _dir = 'components/common/artwork/manage/view/product/';
	return {
		templateUrl: _dir + 'tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { artwork: '=' },
		controller: ['$scope', function ($scope) {

			var artwork;

			var init = function () {
				$scope.grid = {
					fetchPage: function(req) {
						req.Filters.ArtworkID = artwork.ID;

						return productService.search(req).then(function (resp) {
							resp.Data.forEach(function (item) {
								item.LastUpdated = DateUtils.format.friendly(item.updated_at);
								item.LastUpdatedTitle = DateUtils.format.full(item.updated_at);
							});
							return resp;
						});
					},
					state: false,
					pagination: { enabled: false, pageSize: 100 },
					sort: { field: 'Price', direction: 'desc' },
					template: {
						name: 'table',
						header:
						'<tr>' +
							'<th class="product-type" data-sort="ProductType">Type</th>' +
							'<th class="quantity" data-sort="Quantity">Qty</th>' +
							'<th class="size" data-sort="Area">Size</th>' +
							'<th class="price" data-sort="Price">Price</th>' +
							'<th class="buttons"></th>' +
						'</tr>',
						body:
						'<tr class="row body" ng-repeat="item in data" ng-click="config.editProduct(item.ID)">' +
							'<td class="product-type">{{item.ProductType}}</td>' +
							'<td class="quantity">{{item.Quantity == null ? \'&infin;\' : item.Quantity}}</td>' +
							'<td class="size">{{item.WidthMM/10}} x {{item.HeightMM/10}} cm</td>' +
							'<td class="price">&pound;{{item.Price}}</td>' +
							'<td class="buttons"><a class="button light-blue no-text" title="Edit"><i class="fa fa-fw fa-pencil"></i></a></td>' +
						'</tr>'
					},
					noResults: 'No products currently defined for this artwork.',
					editProduct: function (id) {
						$location.url($location.path() + '/product/' + id);
					}
				};
			};

			watchService($scope).watch('artwork', 'ID').then(function (data) {
				artwork = data;
			})
			.then(init);

		}]
	}
}]);

