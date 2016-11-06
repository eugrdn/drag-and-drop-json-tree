(function() {
    'use strict'

    angular.module('dndTreeApp.directives')
        .directive('ngEdit', ngEdit)
        .directive('ngAddBranch', ngAddBranch)
        .directive('ngAddNode', ngAddNode)
        .directive('ngRemove', ngRemove);

    ngEdit.$inject = [];

    function ngEdit() {

        return {
            restrict: 'A',
            link: function(scope, elt) {

                scope.$watch('states.editState', function(data) {
                    var nodes = [...elt[0].getElementsByTagName('INPUT')];

                    if (data) {

                        for (var i = 0; i < nodes.length; i++) {
                            nodes[i].classList.add('editable');
                            nodes[i].readOnly = false;
                        }

                    } else {

                        for (var i = 0; i < nodes.length; i++) {
                            nodes[i].classList.remove('editable');
                            nodes[i].size = nodes[i].value.length || 4;
                            nodes[i].readOnly = true;
                        }

                    }

                });
            }
        }
    }

    ngAddBranch.$inject = [];

    function ngAddBranch() {

        var createInput = function(text, ...className) {
            var input = document.createElement('input');

            input.type = 'text';
            input.value = text;
            input.classList = [...className].join(' ');
            input.readOnly = true;
            input.size = text.length || 5;

            return input;
        };

        var createBranch = function(branchValue, leafValue) {
            var branch = document.createElement('li');

            branch.appendChild(createInput(branchValue, 'tree__branch_value'));
            branch.appendChild(createInput(leafValue, 'tree__branch_leaf_value'));
            branch.classList.add('tree__branch');
            branch.draggable = true;

            return branch;
        };

        return {
            restrict: 'A',
            link: function(scope, elt) {

                scope.$watch('states.addBranchState', function(data) {
                    var nodes = [...elt[0].getElementsByTagName('INPUT')].filter(function(item) {
                        return item.classList.contains('tree__object') || item.classList.contains('tree__array');
                    });

                    if (data) {

                        for (var i = 0; i < nodes.length; i++) {
                            nodes[i].classList.add('branch_addable');
                        }

                    } else {

                        for (var i = 0; i < nodes.length; i++) {
                            nodes[i].classList.remove('branch_addable');
                        }

                    }

                });

                elt[0].addEventListener('click', function(e) {
                    var clickedElt = e.target || event.target;
                    var parent = clickedElt.parentNode;

                    if (clickedElt.tagName != 'INPUT' && !(parent.className === 'tree__object' || parent.className === 'tree__array')) {
                        return;
                    }

                    var newBranch = createBranch('new branch', 'new leaf')

                    if (scope.states.addBranchState) {
                        parent.lastChild.appendChild(newBranch);
                    }
                });

            }
        }
    }

    ngAddNode.$inject = [];

    function ngAddNode() {

        var createInput = function(text, ...className) {
            var input = document.createElement('input');

            input.type = 'text';
            input.value = text;
            input.classList = [...className].join(' ');
            input.size = text.length || 5;
            input.readOnly = true;

            return input;
        };

        var createNode = function(nodeValue) {
            var node = document.createElement('li');

            node.appendChild(createInput(nodeValue, 'tree__object'));
            node.appendChild(document.createElement('ul'));
            node.classList.add('tree__node');
            node.draggable = true;

            return node;
        };

        return {
            restrict: 'A',
            link: function(scope, elt) {

                scope.$watch('states.addNodeState', function(data) {
                    var nodes = [...elt[0].getElementsByTagName('INPUT')].filter(function(item) {
                        return item.classList.contains('tree__object') || item.classList.contains('tree__array');
                    });

                    if (data) {
                        for (var i = 0; i < nodes.length; i++) {
                            nodes[i].classList.add('node_addable');
                        }
                    } else {
                        for (var i = 0; i < nodes.length; i++) {
                            nodes[i].classList.remove('node_addable');
                        }
                    }

                });

                elt[0].addEventListener('click', function(e) {
                    var clickedElt = e.target || event.target;
                    var parent = clickedElt.parentNode;

                    if (clickedElt.tagName != 'INPUT' && !(parent.className === 'tree__object' || parent.className === 'tree__array')) {
                        return;
                    }

                    var newNode = createNode('new node');

                    if (scope.states.addNodeState) {
                        parent.lastChild.appendChild(newNode);
                    }
                });

            }
        }
    }

    ngRemove.$inject = [];

    function ngRemove() {

        return {
            restrict: 'A',
            link: function(scope, elt) {

                scope.$watch('states.removeState', function(data) {
                    var nodes = [...elt[0].getElementsByTagName('INPUT')];

                    if (data) {
                        for (var i = 0; i < nodes.length; i++) {
                            nodes[i].classList.add('removable');
                        }
                    } else {
                        for (var i = 0; i < nodes.length; i++) {
                            nodes[i].classList.remove('removable');
                        }
                    }

                });

                elt[0].addEventListener('click', function(e) {
                    var clickedElt = e.target || event.target;
                    var parent = clickedElt.parentNode;

                    if (clickedElt.tagName != 'INPUT') {
                        return;
                    }

                    if (scope.states.removeState) {
                        parent.parentNode.removeChild(parent);
                    }

                });
            }
        }
    }

})();