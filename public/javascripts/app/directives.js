(function() {

	angular.module('dndTreeApp.directives')
		.directive('ngDomManipulator', ngDomManipulator);

	ngDomManipulator.$inject = [];

	function ngDomManipulator() {

		var isEmpty = function(object) {

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
				} else if (tree[branch] instanceof Object) {
					li.innerHTML = branch;
					li.className = "tree__object";
				} else {
					var p = document.createElement('p');
					p.className = 'tree__p';
					p.innerHTML = tree[branch];
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
			link: function(scope, elt, attrs) {
				scope.$watch('tree', function(data) {
					if (isEmpty(data)) return;
					elt.append(angular.element('<ul></ul>'));
					createTree(data, document.getElementsByTagName('ul')[0]);
				}, true);
			}
		}
	}

})();
// var createDOMTree = function(data) {
// 			var mainUl = document.createElement('ul');

// 			var createTree = function(data, listElement) {
// 				var newLI = document.createElement('li');

// 				for (var key in data) {
// 					if (data[key] instanceof Array) {
// 						newLI.innerHTML = key;
// 						newLI.className = "array";
// 					} else if (data[key] instanceof Object) {
// 						newLI.innerHTML = key;
// 						newLI.className = "object";
// 					} else
// 						newLI.innerHTML = key + ': ' + data[key];

// 					listElement.appendChild(newLI);

// 					if (data[key] instanceof Array || data[key] instanceof Object) {
// 						var newUL = document.createElement('ul');
// 						listElement.appendChild(newUL);
// 						createTree(data[key], newUL);
// 					}

// 				}

// 			};
// 			return mainUl;
// 		}