(function () {

	angular.module('dndTreeApp.controllers')
		.controller('TreeController', TreeController);

	TreeController.$inject = ['treeService', '$scope'];

	function TreeController(treeService, $scope) {

		$scope.treeJson = '';
		$scope.debug = {
			"glossary": {
				"title": "example glossary",
				"GlossDiv": {
					"title": "S",
					"GlossList": {
						"GlossEntry": 3
					}
				}
			}
		};
		treeService.getTree().success(function (data) {
			$scope.treeJson = data;
		});
	}

})();