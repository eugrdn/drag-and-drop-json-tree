(function() {
    'use strict'

    angular.module('dndTreeApp.controllers')
        .controller('ToolsController', ToolsController);

    ToolsController.$inject = ['treeService', '$scope', '$controller', '$http'];

    function ToolsController(treeService, $scope, $controller, $http) {

        var activateState = function(state) {
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

            editValues: function($event) {

                $event.preventDefault();
                activateState('editState');
            },
            addBranch: function($event) {

                $event.preventDefault();
                activateState('addBranchState');

            },
            addNode: function($event) {

                $event.preventDefault();
                activateState('addNodeState');
            },
            removeNode: function($event) {

                $event.preventDefault();
                activateState('removeState');
            },
            save: function() {
                var newTree = parseTreeToDOM(document.getElementById('tree-container'));

                activateState();

                treeService.saveTree(newTree)
                    .success(function(data) { alert('File has been saved successfully!', data); })
                    .error(function(err) { alert('Error while saving', err) });

            }

        };

    }

})();