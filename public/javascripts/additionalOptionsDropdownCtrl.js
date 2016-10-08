var app = angular.module('App');

app.controller('AdditionalOptionsDropdownCtrl', function($scope) {
    $scope.ddSelectOptions = [
        {
            text: 'Emoticon (People)',
            inEmoticonView: true,
            emoticonIndex: 0
        },
        {
            text: 'Emoticon (Nature)',
            inEmoticonView: true,
            emoticonIndex: 1
        },
        {
            text: 'Emoticon (Object)',
            inEmoticonView: true,
            emoticonIndex: 2
        },
        {
            text: 'Emoticon (Places)',
            inEmoticonView: true,
            emoticonIndex: 3
        },
        {
            text: 'Emoticon (Symbol)',
            inEmoticonView: true,
            emoticonIndex: 4
        },
    ];

    $scope.ddSelectSelected = {
        text: 'Emoticon (People)',
        inEmoticonView: true,
        emoticonIndex: 0
    };

    $scope.selectHandler = function(selected) {
        $scope.$parent.handlePageChange(selected);
    };
});

app.directive('nemooAdditionalOptionsDropdown', function(){
    return {
        restrict: 'E',
        scope: {},
        templateUrl: '/views/additionalOptionsDropdown.ejs',
        controller: 'AdditionalOptionsDropdownCtrl',
    };
});