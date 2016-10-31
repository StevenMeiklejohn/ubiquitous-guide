;(function () {
	'use strict';

	function ShortlistDetailsController($scope, $stateParams, shortlistService, $compile, $location) {

		$scope.shortlist = {};
		$scope.ready = false;

		var id = ($stateParams.id || '0') * 1;
		if (!id) {
			$scope.shortlist.Name = 'New Shortlist';
		}

		$scope.archiveShortlist = function () {

			new Dialog({
				title: '<h4>Archive Shortlist</h4>',
				html: '<div class="message">Are you sure you wish to archive this shortlist?</div>',
				buttons: [{
					text: 'Cancel',
					icon: { left: 'fa fa-reply' }
				},{
					text: 'Archive',
					icon: { left: 'fa fa-folder-open' },
					class: 'sky-blue',
					onclick: function(){
						this.tidy();
						var waiting = new Dialog({ html: '<div class="ajax-loader"></div>' });

						shortlistService.archive(id)
							.then(function() {
								$location.url('/shortlists');
							})
							.catch(function(err){
								new Dialog.Info({ title: 'Error', html: '<div class="' + (err.status === 403 ? 'warn' : 'error') + ' message">' + err.data.Message + '</div>' })
							})
							.finally(waiting.tidy);
					}
				}]
			})
		};

		$scope.deleteShortlist = function () {

			new Dialog({
				title: '<h4>Delete Shortlist</h4>',
				html: '<div class="message">Are you sure you wish to delete this shortlist?<br/><br/><strong>Important:</strong> this cannot be undone!</div>',
				buttons: [{
					text: 'Cancel',
					icon: { left: 'fa fa-reply' }
				}, {
					text: 'Delete',
					icon: { left: 'fa fa-trash' },
					class: 'orange',
					onclick: function () {
						this.tidy();
						var waiting = new Dialog({ html: '<div class="ajax-loader"></div>' });

						shortlistService.remove(id)
							.then(function() {
								$location.url('/shortlists');
							})
							.catch(function(err){
								new Dialog.Info({ title: 'Error', html: '<div class="' + (err.status === 403 ? 'warn' : 'error') + ' message">' + err.data.Message + '</div>' })
							})
							.finally(waiting.tidy);
					}
				}]
			})

		};

		$scope.editShortlist = function() {

			$scope.dialog = new Dialog({
				title: '<h4>Update Shortlist</h4>',
				directive: 'shortlist-create',
				$scope: $scope,
				$compile: $compile
			});

		};

		$scope.artworkDetails = function (artworkID) {
			$location.url('/artwork/' + artworkID);
		};


		$scope.artworkGridConfig = {
			autoLoad: false,
			artworkStats: true,
			colours: true,
			event: {
				click: function (e, artwork) {
					$scope.artworkDetails(artwork.ID);
				}

			},
			fetchPage: function (req, complete) {

				var start = req.Pagination.PageSize * req.Pagination.PageNumber;
				req.Pagination.TotalResults = $scope.shortlist.Items.length;

				complete({
					Data: $scope.shortlist.Items.slice(start, start + req.Pagination.PageSize),
					Pagination: req.Pagination
				})

			},
			controls: {
				remove: {
					title: 'Remove from shortlist',
					action: function (artworkID) {

						new Dialog.Confirm({
							title: '<h4>Remove Item</h4>',
							html: '<div class="message">Remove this item from your shortlist?</div>',
							accept: function () {

								var waiting = new Dialog({ html: '<div class="ajax-loader"></div><strong class="ajax-message">Removing from shortlist</strong>' });

								$http.delete('/api/shortlist/' + id + '/artwork/' + artworkID + '/remove')
									.success(function () {
										for (var i in $scope.shortlist.Items) {
											if ($scope.shortlist.Items[i].ID === artworkID) {
												$scope.shortlist.Items.splice(i, 1); break;
											}
										}

										for (var i in $scope.artworkGrid.artworks) {
											if ($scope.artworkGrid.artworks[i].ID === artworkID) {
												$scope.artworkGrid.artworks.splice(i, 1); break;
											}
										}
										$scope.artworkGrid.reload();
									})
									.error(function (resp) {
										new Dialog.Info({ title: 'Error', html: resp.Message });
									})
									.finally(waiting.tidy);
							}
						})
					}
				}
			}
		};


		shortlistService.get(id)
			.then(function (data) {
				$scope.shortlist = data;

				if (!data.Items) {
					$scope.error = { empty: true, message: 'This shortlist is empty, use the <a href="/artist-search\">artist search</a> to find artwork to shortlist.' }
				}
				else {
					$scope.forceDigest(function () {
						$scope.artworkGrid.reset();
					})
				}
			})
			.finally(function () {
				$scope.ready = true;
			})
			.catch(function (err) {
				$scope.error = { type: err.status === 403 ? 'warn' : 'error', message: err.data.Message };
			});


	}


	angular
		.module('ARN')
		.controller('ShortlistDetails', ['$scope', '$stateParams', 'shortlistService', '$compile', '$location', ShortlistDetailsController]);

})();