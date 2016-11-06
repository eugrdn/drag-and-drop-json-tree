(function() {
    'use strict'

    angular.module('dndTreeApp.services')
        .factory('treeService', treeService);

    treeService.$inject = ['$http'];

    function treeService($http) {
        var factory = {};

        factory.getTree = function() {
            return $http.get('/users');
        };

        factory.saveTree = function(treeJson) {
            return $http.post('/users', { json: treeJson });
        };

        return factory;
    }

})();