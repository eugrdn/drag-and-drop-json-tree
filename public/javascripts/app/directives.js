(function () {

	angular.module('dndTreeApp.directives')
		.directive('ngDomManipulator', ngDomManipulator)
		.directive('ngDraggable', ngDraggable)
		.directive('ngDroppable', ngDroppable);

	ngDomManipulator.$inject = [];

	function ngDomManipulator() {

		var isEmpty = function (object) {

			for (var key in object) {
				return false;
			}
			return true;
		};

		function createTree(tree, list) {
			for (var branch in tree) {
				var li = document.createElement('li');
				if (tree[branch] instanceof Array) {
					li.innerHTML = branch;
					li.className = "tree__array";
					// li.draggable= true;
				} else if (tree[branch] instanceof Object) {
					li.innerHTML = branch;
					li.className = "tree__object";
					// li.draggable= true;
				} else {
					var p = document.createElement('p');
					p.className = 'tree__p';
					p.innerHTML = tree[branch];
					// p.draggable= true;
					li.innerHTML = branch;
					li.appendChild(p);
				}

				list.appendChild(li);
				if (tree[branch] instanceof Array || tree[branch] instanceof Object) {
					var ul = document.createElement('ul');
					list.appendChild(ul);
					createTree(tree[branch], ul);
				}
			}
		}


		return {
			restrict: 'E',
			replace: true,
			scope: {
				tree: '='
			},
			link: function (scope, elt, attrs) {
				scope.$watch('tree', function (data) {
					if (isEmpty(data)) return;
					elt.append(angular.element('<ul></ul>'));
					createTree(data, document.getElementsByTagName('ul')[0]);
				}, true);
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
					touchedElt.draggable = true;
					// console.log(`touchedElt: ${touchedElt}, draggable: ${touchedElt.draggable}`);

					touchedElt.addEventListener(
						'dragstart',
						function (e) {
							var _this = e.target.parentNode;
							_this.id = 'dragged';
							e.dataTransfer.effectAllowed = 'move';
							e.dataTransfer.setData('Text', _this.id);
							_this.classList.add('drag');
							//debug
							e.target.parentNode.style.opacity = '.5';
							// console.log(_this.classList);
							return false;
						},
						false
					);

					touchedElt.addEventListener(
						'dragend',
						function (e) {
							var _this = e.target.parentNode;
							_this.classList.remove('drag');
							// console.log(_this.classList);
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
		return {
			restrict: 'A',
			link: function (scope, elt, attrs) {
				elt.on('mouseover', function (e) {
					var hoveredElt = e.target;
					hoveredElt.classList.add('navigator');
					// console.log(hoveredElt);
					hoveredElt.addEventListener(
						'dragover',
						function (e) {
							var _this = e.target.parentNode;
							e.dataTransfer.dropEffect = 'move';
							// allows us to drop
							if (e.preventDefault) e.preventDefault();
							_this.classList.add('over');
							return false;
						},
						false
					);

					hoveredElt.addEventListener(
						'dragenter',
						function (e) {
							var _this = e.target.parentNode;
							_this.classList.add('over');
							return false;
						},
						false
					);

					hoveredElt.addEventListener(
						'dragleave',
						function (e) {
							var _this = e.target.parentNode;
							_this.classList.remove('over');
							return false;
						},
						false
					);

					hoveredElt.addEventListener(
						'drop',
						function (e) {
							// var _this = e.target.parentNode;
							if (e.stopPropagation) e.stopPropagation();

							this.classList.remove('over');

							var item = document.getElementById(e.dataTransfer.getData('Text'));
							console.log(`this: ${this} item: ${item}`);
							this.appendChild(item);

							return false;
						},
						false
					);

					hoveredElt.addEventListener('mouseout', function (e) {
						e.target.classList.remove('navigator');
					});
				});


			}
		}
	}


})();

