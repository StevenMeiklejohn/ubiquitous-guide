

angular.module('ARN')

.directive('profileInfoEdit', [function () {
	return {
		templateUrl: 'components/common/profile/edit/info/tpl.htm',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: ['$scope', '$http', '$element', '$location', '$q', 'profileService', 'artistService', 'socialMediaService', 'videoService', function ($scope, $http, $element, $location, $q, profileService, artistService, socialMediaService, videoService) {

			// copy current profile info from parent scope
			$scope.profile = $scope.$parent.profile;
			$scope.previewImageURI = '/api/proxy/image/' + encodeURIComponent($scope.profile.ImageURI) + '/280';

			$scope._socialMedia = {};
			$scope.profile.SocialMedia.forEach(function(sm){
				$scope._socialMedia[sm.ServiceID] = sm;
			});

			var root = $element.find('form'), form, tabs;

			var	isReady = function () {
				// ensure digest cycle has finished before binding data dependent event listeners
				setTimeout(function () {
					$scope.ready = true;

					// this is the only reliable way to stop unstyled flash-of-content in all cases,
					// a combination of ng-show & ng-cloak do not always work.
					// seems to a be a similar problem: http://weblog.west-wind.com/posts/2014/Jun/02/AngularJs-ngcloak-Problems-on-large-Pages
					// NB: makes the directive appear to load quicker since the ajax loader can be shown instantly
					$element.find('> div').hide().last().show();



					tabs = new Tabs($element.find('.tabs'));

					form = new Form(root, {
						errors: { inline: true },
						field: {
							//Pricebands: { type: 'number', isArray: true },
							//Styles: { type: 'number', isArray: true },
							Types: {type: 'number', isArray: true},
							WorkingSpaces: {type: 'number', isArray: true},
							AgeBracketID: {type: 'number'},
							VideoID: {type: 'number'},
							OpenToCommissions: {type: 'bool'},
							Awards: {isArray: true},
							Qualifications: {isArray: true}
						}
					});

					root.find('[name=VideoID]').change(function () {

						var _preview = root.find('.video-preview');
						_preview.html('');

						var _videoID = $(this).val() * 1,
							_src = '';

						$scope.videos.forEach(function (v) {
							if (v.ID === _videoID) {
								_src = v.VideoURI;
							}
						});

						if (_src) {
							var video = document.createElement('video');
							video.src = _src;

							// output video preview
							//video.style.maxWidth = '500px';
							video.controls = true;
							_preview.append(video);
						}

					}).change();


					var link = root.find('[name=Link]'),
						linkText = root.find('[name=LinkText]'),
						validateLink = function () {
							var lv = link.val(), ltv = linkText.val();

							if ((!lv && !ltv) || (lv && ltv)) {
								link[0].setCustomValidity('');
								linkText[0].setCustomValidity('');
							}
							else if (!lv && ltv) {
								link[0].setCustomValidity('A valid url must be entered if \'Link Text\' has a value');
							}
							else if (lv && !ltv) {
								linkText[0].setCustomValidity('Must have a value if \'Web Link\' has a value');
							}
						};

					link.add(linkText).keyup(validateLink).change(validateLink);
					link.change();

				}, 1);
			};

			var promiseQueue = [];

			promiseQueue.push(
				socialMediaService.listServices().then(function(data) {
					$scope.socialMediaServices = data;
				})
			);

			promiseQueue.push(
					artistService.ageBrackets().then(function(data) {
						$scope.ageBrackets = data;
					})
			);

			promiseQueue.push(
				artistService.types().then(function(data) {
					$scope.artistTypes = data;
				})
			);

			promiseQueue.push(
				artistService.workspaces().then(function(data) {
					$scope.workspaces = data;
				})
			);

			promiseQueue.push(
				videoService.list($scope.profile.ID).then(function(data) {
					$scope.videos = data;
				})
			);

			$q.all(promiseQueue).then(isReady);



			if ($scope.container) {
				$scope.cancel = $scope.container.tidy;
			}


			$scope.imageUploadConfig = {
				folder: 'profile-images',
				accept: 'image/jpeg,image/png',
				success: function (uri, filename) {
					root.find('[name=ImageURI]').val(uri);

					var previewImageURI = '/api/proxy/image/' + encodeURIComponent(uri) + '/280';

					var img = document.createElement('img');
					img.onload = function () {
						$scope.previewImageURI = previewImageURI;
						$scope.$root.forceDigest();
					};
					var retryCount = 0;
					img.onerror = function () {
						if (retryCount < 4) {
							retryCount += 1;

							setTimeout(function () {
								img.src = previewImageURI;
							}, 250)
						}
					};
					img.src = previewImageURI;
				}
			};



			$scope.cancel = function () {
				$location.url('/profile/');
			};


			$scope.save = function () {

				tabs.root.find('.tab-nav-item').removeClass('invalid');

				if (!form.isValid()) {
					form.displayValidationErrors();

					// update tabs to make it obvious which ones contain errors
					tabs.root.find('.tab-panel').each(function () {
						if ($(this).find(':invalid').size()) {
							var _idx = $(this).data('index');
							tabs.root.find('.tab-nav-item:nth-child(' + (_idx + 1) + ')').addClass('invalid');
						}
					});

					tabs.root.find('.tab-nav-item.invalid').first().click();

					// switch to first tab with errors
				}
				else {
					var _data = form.getData();

					// tidy up social media data
					var _sm = [];
					for (var i in _data.SocialMedia) {
						if (_data.SocialMedia[i]) {
							_sm.push({
								ServiceID: i.split('-')[1],
								URL: _data.SocialMedia[i]
							});
						}
					}
					_data.SocialMedia = _sm;


					profileService.update($scope.profile.ID, _data)
						.then(function(){
							$location.url('/profile/');
						})
						.catch(function (res) {
							new Dialog.Info({
								title: '<h3 class="uppercase">Error</h3>',
								fixed: true,
								html:
									'<div class="message error">' +
										(res.Message ? res.Message : 'An error occurred while saving') +
									'</div>'
							});
						})




				}

			}

		}]
	}
}]);

