(function(){

angular.module('ARN')
	.directive('uiMessage', ['$sce', function ($sce) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				config: '='
			},
			templateUrl: 'components/common/ui/message/tpl.htm',
			link: function ($scope) {
				$scope.$watch('config', function(val) {
					if (val && val.message) {
						switch(val.type) {
							case 'error': $scope.iconClass= 'times'; break;
							case 'warn': $scope.iconClass= 'exclamation-triangle'; break;
							case 'success': $scope.iconClass= 'check'; break;
							case 'question': $scope.iconClass= 'question-circle'; break;
							default: $scope.iconClass = 'exclamation-circle'; break;
						}
						$scope.config._message = $sce.trustAsHtml(val.message);
					}
				})
			}
		}
	}])
})();