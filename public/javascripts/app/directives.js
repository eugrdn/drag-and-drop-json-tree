(function() {
	angular.module('dndTreeApp.directives')
						.directive('domManipulator', domManipulator);

	domManipulator.$inject = [];
	function domManipulator() {
		return {
			restrict: 'A',
			require: ngModel,
			link: function (scope, elt, attrs, controller) {
				
			}
		}
	}

})()