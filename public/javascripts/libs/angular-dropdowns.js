/**
 * @license MIT http://jseppi.mit-license.org/license.html
 */
(function (window, angular) {
  'use strict';

  var dd = angular.module('ngDropdowns', []);

  dd.run(['$templateCache', function ($templateCache) {
    $templateCache.put('ngDropdowns/templates/dropdownSelect.html', [
      '<div id="dropdown-custom-angular" ng-mousedown="toggleDropDown($event)" ng-class="{\'disabled\': dropdownDisabled}" class="wrap-dd-select" tabindex="0">',
      '<span ng-mousedown="toggleDropDown($event)" class="selected">{{dropdownModel[labelField]}}</span>',
      '<ul class="dropdown">',
      '<li ng-repeat="item in dropdownSelect"',
      ' class="dropdown-item"',
      ' dropdown-select-item="item"',
      ' dropdown-item-label="labelField">',
      '</li>',
      '</ul>',
      '</div>'
    ].join(''));

    $templateCache.put('ngDropdowns/templates/dropdownSelectItem.html', [
      '<li ng-class="{divider: (dropdownSelectItem.divider && !dropdownSelectItem[dropdownItemLabel]), \'divider-label\': (dropdownSelectItem.divider && dropdownSelectItem[dropdownItemLabel])}">',
      '<a href="" class="dropdown-item"',
      ' ng-if="!dropdownSelectItem.divider"',
      ' ng-href="{{dropdownSelectItem.href}}"',
      ' ng-mousedown="selectItem($event)">',
      '{{dropdownSelectItem[dropdownItemLabel]}}',
      '</a>',
      '<span ng-if="dropdownSelectItem.divider">',
      '{{dropdownSelectItem[dropdownItemLabel]}}',
      '</span>',
      '</li>'
    ].join(''));
  }]);

  dd.directive('dropdownSelect', [
    function () {
      return {
        restrict: 'A',
        replace: true,
        scope: {
          dropdownSelect: '=',
          dropdownModel: '=',
          dropdownItemLabel: '@',
          dropdownOnchange: '&',
          dropdownDisabled: '='
        },

        controller: ['$scope', '$timeout', function ($scope, $timeout) {
          var that = this;
          $scope.labelField = $scope.dropdownItemLabel || 'text';

          this.select = function (selected) {
            if (!angular.equals(selected, $scope.dropdownModel)) {
                $scope.dropdownModel = selected;
            }
            $scope.dropdownOnchange({
              selected: selected
            });
            that.$el.removeClass('active');
          };

          $scope.toggleDropDown = function($event) {
            $event.stopPropagation();
            $event.preventDefault();
            if (!$scope.dropdownDisabled) {
              that.$el.toggleClass('active');
            }
          };

          $timeout(function(){
            that.$el = angular.element(document.getElementById('dropdown-custom-angular'));
          });
        }],
        templateUrl: 'ngDropdowns/templates/dropdownSelect.html'
      };
    }
  ]);

  dd.directive('dropdownSelectItem', [
    function () {
      return {
        require: '^dropdownSelect',
        replace: true,
        scope: {
          dropdownItemLabel: '=',
          dropdownSelectItem: '='
        },

        link: function (scope, element, attrs, dropdownSelectCtrl) {
          scope.selectItem = function ($event) {
            $event.stopPropagation();
            $event.preventDefault();
            if (scope.dropdownSelectItem.href) {
              return;
            }
            dropdownSelectCtrl.select(scope.dropdownSelectItem);
          };
        },

        templateUrl: 'ngDropdowns/templates/dropdownSelectItem.html'
      };
    }
  ]);
})(window, window.angular);