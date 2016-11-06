(function () {
    'use strict'

    angular.module('dndTreeApp.controllers')
        .controller('TreeController', TreeController)
        .controller('ToolsController', ToolsController);

    TreeController.$inject = ['treeService', '$scope', '$http'];

    function TreeController(treeService, $scope, $http) {

        treeService.getTree()
            .success(function (data) { $scope.treeJson = data; })
            .error(function (err) { $scope.treeJson = { "error": "404" }; alert(err); });

        $scope.states = {
            editState: false,
            addBranchState: false,
            addNodeState: false,
            removeState: false
        }

    }

    ToolsController.$inject = ['treeService', '$scope', '$controller', '$http'];

    function ToolsController(treeService, $scope, $controller, $http) {

        var activateState = function (state) {
            var _states = $scope.states;

            for (var key in _states) {

                if (key !== state) {
                    _states[key] = false;
                } else {
                    _states[key] = !_states[key];
                }

            }
        };

        var parseTreeToDOM = function parse(tree, object) {
            var object = object || {};

            if (tree.tagName === 'UL' || (tree.tagName === 'LI' && tree.className === '')) {
                parse(tree.children, object);
            }

            for (var i = 0; i < tree.length; i++) {

                if (tree[i].classList.contains('tree__branch')) {

                    if (object instanceof Array) {
                        object.push(tree[i].lastChild.value);
                    } else if (object instanceof Object) {
                        object[tree[i].firstChild.value] = tree[i].lastChild.value;
                    }

                } else if (tree[i].classList.contains('tree__node')) {

                    if (tree[i].firstChild.classList.contains('tree__object')) {
                        object[tree[i].firstChild.value] = {};
                    } else if (tree[i].firstChild.classList.contains('tree__array')) {
                        object[tree[i].firstChild.value] = [];
                    }

                    parse(tree[i].lastChild, object[tree[i].firstChild.value]);

                }

            }

            return object;
        };

        $scope.tools = {

            editValues: function ($event) {

                $event.preventDefault();
                activateState('editState');
                console.log($scope.states)
            },
            addBranch: function ($event) {

                $event.preventDefault();
                activateState('addBranchState')
                console.log($scope.states)

            },
            addNode: function ($event) {

                $event.preventDefault();
                activateState('addNodeState');
                console.log($scope.states)
            },
            removeNode: function ($event) {

                $event.preventDefault();
                activateState('removeState');
                console.log($scope.states)
            },
            save: function () {
                var newTree = parseTreeToDOM(document.getElementById('tree_container'));
                activateState();
                console.log($scope.states)
                treeService.saveTree(newTree)
                    .success(function (data) { alert('File has been saved successfully!', data); })
                    .error(function (err) { alert('Error while saving', err) });

            }

        };

    }

})();