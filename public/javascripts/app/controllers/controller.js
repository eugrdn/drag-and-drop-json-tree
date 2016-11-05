(function() {

    angular.module('dndTreeApp.controllers')
        .controller('TreeController', TreeController);

    TreeController.$inject = ['treeService', '$scope', '$http'];

    function TreeController(treeService, $scope, $http) {

        $scope.treeJson = '';
        $scope.addState = false;
        $scope.rmState = false;
        
        //debug
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
        };

        treeService.getTree()
            .success(function(data) {
                $scope.treeJson = data;
            })
            .error(function(err) {
                alert(err);
            });

        
        $scope.edit = function(treeJson) {
			console.log(treeJson);
        };

        $scope.saveToFile = function(treeJson) {
            treeService.saveTree(treeJson)
                .success(function(data) {
                    alert('File has been saved successfully!', data);
                })
                .error(function(err) {
                    alert('Error while saving', err)
                });
        };

        $scope.addNodes = function($event){
            $event.preventDefault();
            $scope.rmState = false;
            $scope.addState = !$scope.addState;
        }

        $scope.removeNodes = function($event){
            $event.preventDefault();
            $scope.addState = false;
            $scope.rmState = !$scope.rmState;
        }
        

    }

})();