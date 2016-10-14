(function() {

	angular.module('dndTreeApp.controllers').controller('TreeController', TreeController);

	TreeController.$inject = ['$scope', '$http'];

	function TreeController($scope, $http) {

		// $http({method:'GET',url:'/src/example.json'}).success(function (data) {
		// 	$scope.exampleJson = data;	
		// 	console.log(data);
		// });
		$scope.data = [
      {listName: "A", items: [], dragging: false},
      {listName: "B", items: [], dragging: false}
    ];
		$scope.exampleJson = angular.toJson($scope.data, true);
		console.log($scope.data);

	}

})();