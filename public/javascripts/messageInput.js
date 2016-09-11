    var app         = angular.module('App');

	app.controller('MessageInputCtrl', function($timeout, $scope) {
        var that = this;
        this.message = '';
        $timeout(function(){
            $('#message-input-box').focus();
            console.log(this.message.length);
        }, 0);
        this.send = function() {
            if(this.message) {
                this.main.socket.emit('message sent', this.message, this.main.user);
                this.message = '';
            }
        };
        this.init = function(main){
            this.main = main;
        };
    });

    app.directive('onEnterPressed', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.onEnterPressed);
                    });

                    event.preventDefault();
                }
            });
        };
    });

    app.directive('nemooMessageInput', function() {
        return {
            restrict: 'E',
            templateUrl: '/views/messageInput.ejs',
            controller: 'MessageInputCtrl',
            controllerAs: 'messageCtrl'
        };
    });