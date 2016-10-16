(function() {
	angular.module('dndTreeApp.services')
			.factory('treeService', treeService);

	treeService.$inject = ['$http'];

	function treeService($http) {
		var factory = {};
		factory.getTree = function () {
			return $http.get('/src/example.json');
		};
		return factory;
	}
})();