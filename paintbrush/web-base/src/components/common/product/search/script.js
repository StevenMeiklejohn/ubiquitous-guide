angular.module('ARN')

.directive('productSearch', ['$location', '$q', 'productService', 'proxyService', 'watchService',
					function ($location, $q, productService, proxy, watchService) {

	var _dir = 'components/common/product/search/';
	return {
		templateUrl: _dir + 'tpl.htm',
		//css: { href: _dir + 'styles.css', preload: true },
		restrict: 'E',
		replace: true,
		scope: {
			profile: '=',
			artwork: '='
		},
		controller: function ($scope) {

			var profile, artwork,
				productTypes;

			var init = function () {
				$scope.grid = {
					fetchPage: function(req) {
						if (profile) {
							req.Filters.ProfileID = profile.ID;
						}
						else {
							req.Filters.ArtworkID = artwork.ID;
						}

						return productService.search(req).then(function (resp) {
							resp.Data.forEach(function (item) {
								item.LastUpdated = DateUtils.format.friendly(item.updated_at);
								item.LastUpdatedTitle = DateUtils.format.full(item.updated_at);
							});
							return resp;
						});
					},
					filters: [
						{ type: 'list', field: 'ProductTypeID', label: 'Product Type', options: productTypes },
						{ type: 'spacer' },
						{ type: 'pagination' }
					],
					sort: { field: 'Price', direction: 'desc' },
					template: {
						name: 'table',
						header:
							'<tr>' +
								'<th class="product-type" data-sort="ProductType">Product Type</th>' +
								'<th class="quantity" data-sort="Quantity">Quantity</th>' +
								'<th class="size" data-sort="Area">Size</th>' +
								'<th class="price" data-sort="Price">Price</th>' +
								'<th class="last-updated" data-sort="LastUpdated">Last Updated</th>' +
							'</tr>',
						body:
							'<tr class="row body" ng-repeat="item in data" ng-click="config.editProduct(item.ID)">' +
								'<td class="product-type">{{item.ProductType}}</td>' +
								'<td class="quantity">{{item.Quantity == null ? \'&infin;\' : item.Quantity}}</td>' +
								'<td class="size">{{item.WidthMM/10}} x {{item.HeightMM/10}} cm</td>' +
								'<td class="price">{{item.Price}}</td>' +
								'<td class="last-updated" title="{{item.LastUpdatedTitle}}">{{item.LastUpdated}}</td>' +
							'</tr>'
					},
					editProduct: function (id) {
						$location.url($location.path() + '/' + id);
					}
				};
			};


			$q.all([
				watchService($scope).any({ artwork: 'ID', profile: 'ID' }).then(function (data) {
					profile = data.profile;
					artwork = data.artwork;
				}),
				productService.types().then(function (data) {
					productTypes = data.map(function (t) {
						return { label: t.Type, value: t.ID };
					});
				})
			])
			.then(init);


		}
	}
}]);