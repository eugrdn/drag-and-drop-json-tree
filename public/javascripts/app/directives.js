(function () {

	angular.module('dndTreeApp.directives')
		.directive('ngDomTree', ngDomTree)
		.directive('ngDraggable', ngDraggable)
		.directive('ngDroppable', ngDroppable);

	ngDomTree.$inject = [];

	function ngDomTree() {

		var isEmpty = function (object) {
			for (var key in object) {
				return false;
			}

			return true;
		};

		var createInput = function (text, ...className) {
			var input = document.createElement('input');

			input.type = 'text';
			input.value = text;
			input.classList = [...className].join(' ');
			input.readOnly = true;

			return input;
		};

		var createTree = function (tree, list) {

			for (var branch in tree) {

				var li = document.createElement('li');
				var _li = document.createElement('li');
				var _ul = document.createElement('ul');

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

					_li.appendChild(_ul);
					li.appendChild(_li);
					createTree(tree[branch], _ul);

				}

				list.appendChild(li);
			}
		}

		return {
			restrict: 'E',
			replace: true,
			link: function (scope, elt, attrs) {

				scope.$watch('treeJson', function (data) {

					if (isEmpty(data)) {
						return
					};

					if (elt[0].firstChild) {
						elt[0].removeChild(elt[0].firstChild);
					}

					elt[0].appendChild(document.createElement('ul'));

					createTree(data, document.getElementsByTagName('ul')[0]);

				});

			}
		}
	}


	ngDraggable.$inject = [];

	function ngDraggable() {
		return {
			restrict: 'A',
			link: function (scope, elt, attrs) {
				elt[0].addEventListener('dragstart', function (e) {
					var touchedElt = e.target || event.target;
					//debug

					if (touchedElt.tagName != 'LI') {
						return;
					}

					touchedElt.id = 'dragged';
					e.dataTransfer.effectAllowed = 'move';
					e.dataTransfer.setData('Text', touchedElt.id);
					touchedElt.classList.add('drag');

					//debug
					e.target.style.opacity = '.5';
				});

				elt[0].addEventListener('dragend', function (e) {
					var touchedElt = e.target || event.target;

					if (touchedElt.tagName != 'LI') {
						return;
					}

					touchedElt.classList.remove('drag');

					//debug
					e.target.style.opacity = '1';

				});
			}
		}
	}

	ngDroppable.$inject = [];

	function ngDroppable() {

		var parseTreeToDOM = function parse(tree, object) {
			var object = object || {};

			if (tree.tagName === 'UL' || (tree.tagName === 'LI' && tree.className === '')) {
				parse(tree.children, object);
			}

			for (var i = 0; i < tree.length; i++) {

				if (tree[i].className === 'tree__branch') {

					if (object instanceof Array) {
						object.push(tree[i].lastChild.value);
					} else if (object instanceof Object) {
						object[tree[i].firstChild.value] = tree[i].lastChild.value;
					}

				} else if (tree[i].className === 'tree__node') {

					if (tree[i].firstChild.className === 'tree__object') {
						object[tree[i].firstChild.value] = {};
					} else if (tree[i].firstChild.className === 'tree__array') {
						object[tree[i].firstChild.value] = [];
					}
					parse(tree[i + 1].children[0], object[tree[i].firstChild.value]);
				}

			}

			return object;
		};

		return {
			restrict: 'A',
			link: function (scope, elt, attrs) {

				elt[0].addEventListener('dragover', function (e) {
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

					e.dataTransfer.dropEffect = 'move';

					if (e.preventDefault) {
						e.preventDefault();
					}

					droppableElt.classList.add('over');

				});

				elt[0].addEventListener('dragenter', function (e) {
					var droppableElt = e.target || event.target;
					var parent = droppableElt.parentNode;

					if (droppableElt.tagName != 'INPUT' && !(parent.className === 'tree__node' || parent.className === 'tree__branch')) {
						return;
					}

					parent.classList.add('over');

				});

				elt[0].addEventListener('dragleave', function (e) {
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


					parent.classList.remove('navigator');

				});

				elt[0].addEventListener('drop', function (e) {
					var droppableElt = e.target || event.target;
					var parent = droppableElt.parentNode;
					var item = document.getElementById(e.dataTransfer.getData('Text'));

					if (droppableElt.tagName != 'INPUT' && !(parent.className === 'tree__node' || parent.className === 'tree__branch')) {
						return;
					}

					if (e.stopPropagation) {
						e.stopPropagation();
					}

					parent.classList.remove('over');

					if (parent.className === 'tree__node') {
						parent.appendChild(item);
					} else if (parent.className === 'tree__branch') {
						parent.insertBefore(item,droppableElt.nextSibling);
					}

					item.id = '';

					scope.treeJson = parseTreeToDOM(elt[0].children[0]);
					scope.$digest();

				});

			}
		}
	}

})();