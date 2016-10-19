var app = angular.module('App');
app.directive('dropdownSelect', [
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
        $scope.disabled = $scope.dropdownDisabled || false;

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

        $scope.$on('$destroy', function(){
          that.$el = null;
        });
      }],
      templateUrl: '/views/dropdownSelect.ejs'
    };
  }
]);

app.directive('dropdownSelectItem', [
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

      templateUrl: '/views/dropdownSelectItem.ejs'
    };
  }
]);