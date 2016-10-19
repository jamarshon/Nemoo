var app = angular.module('App');

app.controller('AdditionalOptionsDropdownCtrl', ['$scope', function($scope) {
    $scope.ddSelectOptions = [
        {
            text: 'Upload Images or Gifs',
            pageKey: 'images',
            divider: false,
            href: false
        },
        {
            text: 'Emoticon (People)',
            pageKey: 'people',
            divider: false,
            href: false
        },
        {
            text: 'Emoticon (Nature)',
            pageKey: 'nature',
            divider: false,
            href: false
        },
        {
            text: 'Emoticon (Object)',
            pageKey: 'object',
            divider: false,
            href: false
        },
        {
            text: 'Emoticon (Places)',
            pageKey: 'places',
            divider: false,
            href: false
        },
        {
            text: 'Emoticon (Symbol)',
            pageKey: 'symbol',
            divider: false,
            href: false
        },
    ];

    $scope.ddSelectSelected = {
        text: 'Emoticon (People)',
        pageKey: 'people',
        divider: false,
        href: false
    };

    $scope.selectHandler = function(selected) {
        $scope.$parent.handlePageChange(selected);
    };
}]);

app.directive('nemooAdditionalOptionsDropdown', function(){
    return {
        restrict: 'E',
        scope: true,
        templateUrl: '/views/additionalOptionsDropdown.ejs',
        controller: 'AdditionalOptionsDropdownCtrl',
    };
});