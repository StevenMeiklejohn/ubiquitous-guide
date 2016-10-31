

angular.module('ARN')

.directive('artworkWizardIndex', ['$location', 'watchService', function ($location, watchService) {
	var _dir = 'components/common/artwork/wizard/index/';
	return {
		templateUrl: _dir + 'tpl.htm',
		replace: true,
		restrict: 'E',
		scope: { profile: '=' },
		controller: ['$scope', function ($scope) {

			console.info($scope);

			var watch = watchService($scope).watch;

			//
			// Name and order of all steps in wizard
			//
			var steps = [
				'instructions',
				'images',
				'general',
				//'description',
				'activcanvas'
				//'product'
			];

			//
			// Keep track of current step
			//
			var currentStep = $scope.currentStep = steps[0];

			//
			// List of all ID and ImageURIs of artworks being updated by wizard
			//
			var artworks = [];

			//
			// Config data for step directives - defined when navigating to step using $scope.next()
			//
			var config = $scope.config = { };

			//
			// Defines config data for the specified step directive if not already defined
			//
			var defineConfig = function (step) {

				if (!config[step]) {

					var _conf = {
						artworks: artworks
					};

					switch (step) {

						case 'images': break;

						case 'general': break;

						case 'description': break;

						case 'activcanvas': break;

						case 'product': break;

					}

					config[step] = _conf;
				}


			};


			//
			// Flag if current step is complete
			//
			$scope.stepComplete = true;
			var stepCompleteWatcher;


			//
			// Goes to next step in wizard
			//
			$scope.next = function () {
				if ($scope.stepComplete) {

					// grab artwork data from current step if it exists
					if (!artworks.length && config[currentStep] && config[currentStep].artworks) {
						artworks = config[currentStep].artworks;
					}

					var nextStep = steps[steps.indexOf(currentStep) + 1];

					if (!nextStep) {
						$location.url('/artwork/manage');
					}
					else {
						$scope.loadingStep = true;

						defineConfig(nextStep);

						stepCompleteWatcher && stepCompleteWatcher();
						stepCompleteWatcher = $scope.$watch('config.' + nextStep + '.complete', function (val) {
							$scope.stepComplete = !!val;
						});

						watch('config.' + nextStep + '.ready', 'value', true).then(function () {
							$scope.loadingStep = false;
						});

						currentStep = $scope.currentStep = nextStep;
					}

				}
			};

		}]
	}
}]);

