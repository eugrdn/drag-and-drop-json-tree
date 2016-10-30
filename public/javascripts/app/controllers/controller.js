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
						"GlossEntry": {
							"ID": "SGML",
							"SortAs": "SGML",
							"GlossTerm": "Standard Generalized Markup Language",
							"Acronym": "SGML",
							"Abbrev": "ISO 8879:1986",
							"GlossDef": {
								"para": "A meta-markup language, used to create markup languages such as DocBook.",
								"GlossSeeAlso": ["GML", "XML"]
							},
							"GlossSee": "markup"
						}
					}
				}
			}
		}
		//debug
		console.log($scope.debug)
		treeService.getTree().success(function (data) {
			$scope.treeJson = data;
		});
	}

})();