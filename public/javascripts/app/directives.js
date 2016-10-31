(function () {

	angular.module('dndTreeApp.directives')
		.directive('ngDomTree', ngDomTree)
		.directive('ngDraggable', ngDraggable)
		.directive('ngDroppable', ngDroppable)
		.directive('ngFormatter', ngFormatter);

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
				if (tree[branch] instanceof Array) {
					li.appendChild(createInput(branch, 'tree__array'));
					li.className = 'tree__node';
				} else if (tree[branch] instanceof Object) {
					li.appendChild(createInput(branch, 'tree__object'));
					li.className = 'tree__node';
				} else {
					li.appendChild(createInput(branch, 'tree__branch_value'));
					li.appendChild(createInput(tree[branch], 'tree__branch_leaf_value'));
					li.classList = 'tree__branch';
				}
				list.appendChild(li);
				if (tree[branch] instanceof Array || tree[branch] instanceof Object) {
					var li = document.createElement('li'),
						ul = document.createElement('ul');
					li.appendChild(ul);
					list.appendChild(li);
					createTree(tree[branch], ul);
				}
			}
		}
		return {
			restrict: 'E',
			replace: true,
			link: function (scope, elt, attrs) {
				scope.$watch('treeJson', function (data) {
					if (isEmpty(data)) return;
					if (elt[0].firstChild)
						elt[0].removeChild(elt[0].firstChild);
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
				elt.on('mouseover', function (e) {

					var touchedElt = e.target || event.target;
					if (touchedElt.tagName != 'INPUT')
						return;

					touchedElt.draggable = true;

					touchedElt.addEventListener(
						'dragstart',
						function (e) {
							this.id = 'dragged';
							e.dataTransfer.effectAllowed = 'move';
							e.dataTransfer.setData('Text', this.id);
							this.classList.add('drag');
							//debug
							e.target.style.opacity = '.5';
							return false;
						},
						false
					);

					touchedElt.addEventListener(
						'dragend',
						function (e) {
							this.classList.remove('drag');
							//debug
							e.target.style.opacity = '1';
							return false;
						},
						false
					);

				});
			}
		}
	}

	ngDroppable.$inject = [];
	function ngDroppable() {

		var parseTreeToDOM = function parse(tree, object) {
			var object = object || {};
			if (tree.tagName === 'UL' || (tree.tagName === 'LI' && tree.className === ''))
				parse(tree.children, object);
			for (var i = 0; i < tree.length; i++) {
				if (tree[i].className === 'tree__branch') {
					if (object instanceof Array)
						object.push(tree[i].lastChild.value);
					else if (object instanceof Object)
						object[tree[i].firstChild.value] = tree[i].lastChild.value;
				} else if (tree[i].className === 'tree__node') {
					if (tree[i].firstChild.className === 'tree__object')
						object[tree[i].firstChild.value] = {};
					else if (tree[i].firstChild.className === 'tree__array')
						object[tree[i].firstChild.value] = [];
					parse(tree[i + 1].children[0], object[tree[i].firstChild.value]);
				}
			}
			return object;
		};

		return {
			restrict: 'A',
			link: function (scope, elt, attrs) {
				elt.on('mouseover', function (e) {

					var droppableElt = e.target || event.target;
					if (!droppableElt.classList.contains('tree__node') && !droppableElt.classList.contains('tree__branch'))
						return;

					droppableElt.addEventListener(
						'dragover',
						function (e) {

							this.classList.add('navigator');
							e.dataTransfer.dropEffect = 'move';
							if (e.preventDefault)
								e.preventDefault();
							this.classList.add('over');
							return false;
						},
						false
					);

					droppableElt.addEventListener(
						'dragenter',
						function (e) {
							this.classList.add('over');
							return false;
						},
						false
					);

					droppableElt.addEventListener(
						'dragleave',
						function (e) {
							this.classList.remove('over');
							this.classList.remove('navigator');
							return false;
						},
						false
					);

					droppableElt.addEventListener(
						'drop',
						function (e) {

							if (e.stopPropagation) e.stopPropagation();
							this.classList.remove('over');
							let item = document.getElementById(e.dataTransfer.getData('Text'));
							this.appendChild(item);
							item.id = '';
							scope.treeJson = parseTreeToDOM(elt[0].children[0]);
							scope.$digest();
							return false;
						},
						false
					);
				});
			}
		}
	}

	ngFormatter.$inject = [];
	function ngFormatter() {
		return {
			restrict: 'A',
			link: function (scope, elt, attrs) {

			}
		}
	}

})();