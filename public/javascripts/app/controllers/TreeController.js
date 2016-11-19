(function() {
    'use strict'

    angular.module('dndTreeApp.controllers')
        .controller('TreeController', TreeController);

    TreeController.$inject = ['treeService', '$scope', '$http'];

    function TreeController(treeService, $scope, $http) {

        treeService.getTree()
            .success(function(data) { $scope.treeJson = data; })
            .error(function(err) { $scope.treeJson = { "error": "404" }; alert(err); });

        $scope.states = {
            editState: false,
            addBranchState: false,
            addNodeState: false,
            removeState: false
        };
    }

})();