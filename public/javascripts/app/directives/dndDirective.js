(function() {
    'use strict'

    angular.module('dndTreeApp.directives')
        .directive('ngDraggable', ngDraggable)
        .directive('ngDroppable', ngDroppable);

    ngDraggable.$inject = [];

    function ngDraggable() {

        return {
            restrict: 'A',
            link: function(scope, elt) {

                elt[0].addEventListener('dragstart', function(e) {
                    var touchedElt = e.target || event.target;

                    if (touchedElt.tagName != 'LI') {
                        return;
                    }

                    touchedElt.id = 'dragged';
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('Text', touchedElt.id);
                    touchedElt.classList.add('drag');

                    e.target.style.opacity = '.5';
                });

                elt[0].addEventListener('dragend', function(e) {
                    var touchedElt = e.target || event.target;

                    if (touchedElt.tagName != 'LI') {
                        return;
                    }

                    touchedElt.classList.remove('drag');

                    e.target.style.opacity = '1';
                });
            }
        }
    }

    ngDroppable.$inject = [];

    function ngDroppable() {

        return {
            restrict: 'A',
            link: function(scope, elt) {

                elt[0].addEventListener('dragover', function(e) {
                    var droppableElt = e.target || event.target;
                    var parent = droppableElt.parentNode;

                    if (droppableElt.tagName != 'INPUT' && !(parent.className === 'tree__node' || parent.className === 'tree__branch')) {
                        return;
                    }

                    e.dataTransfer.dropEffect = 'move';

                    if (e.preventDefault) {
                        e.preventDefault();
                    }

                    parent.classList.add('over');

                });

                elt[0].addEventListener('dragenter', function(e) {
                    var droppableElt = e.target || event.target;
                    var parent = droppableElt.parentNode;

                    if (droppableElt.tagName != 'INPUT' && !(parent.className === 'tree__node' || parent.className === 'tree__branch')) {
                        return;
                    }

                    if (parent.classList.contains('tree__branch')) {
                        parent.children[0].classList.add('navigator');
                        parent.children[1].classList.add('navigator');

                    } else {
                        droppableElt.classList.add('navigator');
                    }

                    parent.classList.add('over');

                });

                elt[0].addEventListener('dragleave', function(e) {
                    var droppableElt = e.target || event.target;
                    var parent = droppableElt.parentNode;

                    if (droppableElt.tagName != 'INPUT' && !(parent.className === 'tree__node' || parent.className === 'tree__branch')) {
                        return;
                    }

                    if (parent.classList.contains('tree__branch')) {
                        parent.children[0].classList.remove('navigator');
                        parent.children[1].classList.remove('navigator');

                    } else {
                        droppableElt.classList.remove('navigator');
                    }

                    parent.classList.remove('over');

                });

                elt[0].addEventListener('drop', function(e) {
                    var droppableElt = e.target || event.target;
                    var parent = droppableElt.parentNode;
                    var item = document.getElementById(e.dataTransfer.getData('Text'));

                    if (droppableElt.tagName != 'INPUT' && !(parent.className === 'tree__node' || parent.className === 'tree__branch')) {
                        return;
                    }

                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }

                    if (parent.classList.contains('tree__branch')) {
                        parent.children[0].classList.remove('navigator');
                        parent.children[1].classList.remove('navigator');

                    } else {
                        droppableElt.classList.remove('navigator');
                    }

                    parent.classList.remove('over');

                    if (parent.className === 'tree__node') {
                        parent.lastChild.appendChild(item);
                    } else if (parent.className === 'tree__branch') {
                        parent.parentNode.insertBefore(item, parent);
                    }

                    item.id = '';

                });

            }
        }
    }

})();