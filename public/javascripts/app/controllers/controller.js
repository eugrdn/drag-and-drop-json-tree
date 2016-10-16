(function () {

	angular.module('dndTreeApp.controllers')
		.controller('TreeController', TreeController);

	TreeController.$inject = ['treeService', '$scope'];

	function TreeController(treeService, $scope) {
		
		$scope.exampleJson = '';
		
		treeService.getTree().success(function (data) {
			$scope.exampleJson = data;
		});
		
	}

})();