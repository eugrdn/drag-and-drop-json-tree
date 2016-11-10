(function() {
    'use strict'

    angular.module('dndTreeApp.directives')
        .directive('ngDomTree', ngDomTree);

    ngDomTree.$inject = ['$window'];

    function ngDomTree($window) {

        var isEmpty = function(object) {
            for (var key in object) {
                return false;
            }

            return true;
        };

        var createInput = function(text, ...className) {
            var input = document.createElement('input');

            input.type = 'text';
            input.value = text;
            input.classList = [...className].join(' ');
            input.readOnly = true;
            input.size = text.length || 5;

            return input;
        };

        var createTree = function(tree, list) {

            for (var branch in tree) {

                var li = document.createElement('li');
                var _li = document.createElement('li');
                var _ul = document.createElement('ul');
                var __ul = document.createElement('ul');

                if (tree[branch] instanceof Array) {

                    li.appendChild(createInput(branch, 'tree__array'));
                    li.className = 'tree__node';
                    li.draggable = true;

                } else if (tree[branch] instanceof Object) {

                    li.appendChild(createInput(branch, 'tree__object'));
                    li.className = 'tree__node';
                    li.draggable = true;

                } else {

                    li.appendChild(createInput(branch, 'tree__branch_value'));
                    li.appendChild(createInput(tree[branch], 'tree__branch_leaf_value'));
                    li.classList = 'tree__branch';
                    li.draggable = true;

                }

                if (tree[branch] instanceof Array || tree[branch] instanceof Object) {

                    __ul.appendChild(_li);
                    _li.appendChild(_ul);
                    li.appendChild(_ul);
                    createTree(tree[branch], _ul);

                }

                list.appendChild(li);
            }
        };

        return {
            restrict: 'E',
            replace: true,
            link: function(scope, elt) {

                var tree = document.createElement('ul');
                var root = document.createElement('div');
                var header = document.getElementById('dnd-header');
                var headerBtm = header.getBoundingClientRect().bottom + $window.pageYOffset;

                tree.id = 'tree-container';
                root.id = 'tree-root';
                root.innerHTML = 'tree root';

                scope.$watch('treeJson', function(data) {

                    if (isEmpty(data)) {
                        return
                    };

                    elt[0].appendChild(tree);
                    elt[0].appendChild(root);

                    createTree(data, document.getElementById('tree-container'));
                });

                angular.element($window).on('scroll', function() {
                    if ($window.pageYOffset > headerBtm) {
                        root.classList.add('scrollable');
                    } else if ($window.pageYOffset < headerBtm) {
                        root.classList.remove('scrollable');
                    }
                });

            }
        }
    }

})();